import React, { useContext, useState } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import '../pages/style.scss';
import { AuthContext } from '../context/Auth';

export const Search = () => {
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('displayName', '==', userName)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      console.log('---------->', error);
      setErr(true);
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  };

  const handleSelect = async (e) => {
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, 'chats', combinedID));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, 'chats', combinedID), { messages: [] });

        // create a user chat
        await updateDoc(doc(db,"usersChat",currentUser.uid),{
        [combinedID+".userInfo"]:{
          uid:user.uid,
          displayName:user.displayName,
          photoURL:user.photoURL
        },
        [combinedID+".date"]:serverTimestamp()
        });

        await updateDoc(doc(db,"usersChat",user.uid),{
          [combinedID+".userInfo"]:{
            uid:currentUser.uid,
            displayName:currentUser.displayName,
            photoURL:currentUser.photoURL
          },
          [combinedID+".date"]:serverTimestamp()
          });
      }else{
        console.log(res)
      }
    } catch (error) {
      console.log(error)
    }
    setUser(null)
    setUserName("")
  };

  // console.log(user)

  return (
    <div className='search'>
      <div className='searchForm'>
        <input
          type='text'
          placeholder='Search...'
          onKeyDown={handleKey}
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
      </div>
      {err && <span>User not found</span>}
      {user && (
        <div className='userChat' onClick={handleSelect}>
          <img src={user.photoURL} alt='' />
          <div className='userChatInfo'>
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
