import React, { useState } from 'react'
import {FaLaughBeam} from 'react-icons/fa'
import { Auth,storage, db } from '../firebase'
import {createUserWithEmailAndPassword, updateProfile} from 'firebase/auth'
import {ref ,uploadBytesResumable, getDownloadURL} from "firebase/storage"
import { doc, setDoc } from "firebase/firestore";
import './style.scss'
import { useNavigate } from 'react-router-dom'

export const Register = () => {
  const [err,setError] = useState(false)
  const [file,setFile] = useState()
  const navigate = useNavigate()
  
  const handleSubmit = async(e) =>{
    e.preventDefault()
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    try {
      const res = await createUserWithEmailAndPassword(Auth, email, password)
      const storageRef = ref(storage, displayName)
      const uploadTask = uploadBytesResumable(storageRef, file)

      uploadTask.on('state_changes',
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      (error)=>{
        setError(true)
      },
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await updateProfile(res.user,{
            displayName,
            photoURL: downloadURL
          })
          await setDoc(doc(db, "users",res.user.uid),{
            uid:res.user.uid,
            displayName,
            email,
            photoURL:downloadURL
          })

          await setDoc(doc(db, "usersChat",res.user.uid),{})
          navigate("/")
        });
      }
      )
    } catch (error) {
      setError(true)
    }
    
  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Chat</span>
        <span className='register'>Register</span>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="text" placeholder='display name'/>
          <input type="email" placeholder='email'/>
          <input type="password" placeholder='password'/>
          <input type="file" id='file' style={{display:"none"}} onChange={(e)=> setFile(e.target.files[0])}/>
          <label htmlFor='file' style={{display:"flex", alignItems:"center", cursor:"pointer"}}>
          <FaLaughBeam style={{fontSize:"30px", color:"#7b96ec",marginRight:"10px"}}/>
          <span>Add an avatar</span>
          </label>
          <button>SignUp</button>
          {err && <span style={{color:"red"}}>Something Went Wrong</span>}
        </form>
        <p>You do have account? Login</p>
      </div>
    </div>
  )
}
