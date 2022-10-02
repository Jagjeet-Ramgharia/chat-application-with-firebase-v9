import {
  arrayUnion,
  doc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import { BsImageFill } from 'react-icons/bs';
import { AuthContext } from '../context/Auth';
import { ChatContext } from '../context/ChatContext';
import { v4 as uuid } from 'uuid';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { db, storage } from '../firebase';

export const Input = () => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [text, setText] = useState('');
  const [img, setImg] = useState(null);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        'state_changes',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          // setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img:downloadURL
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "usersChat", currentUser.uid),{
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp()
    })

    await updateDoc(doc(db, "usersChat", data.user.uid),{
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".date"]:serverTimestamp()
    })

    setText("")
    setImg(null)
  };

  return (
    <div className='input'>
      <input
        type='text'
        placeholder='Type something....'
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className='send'>
        <img src='' alt='' />
        <input
          type='file'
          style={{ display: 'none' }}
          id='file'
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor='file'>
          <BsImageFill
            style={{
              fontSize: '30px',
              color: '#7b96ec',
              marginRight: '10px',
              cursor: 'pointer',
            }}
          />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
