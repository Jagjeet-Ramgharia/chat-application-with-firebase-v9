import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { AuthContext } from '../context/Auth'
import { Auth } from '../firebase'
import '../pages/style.scss'

export const Navbar = () => {
  const {currentUser} = useContext(AuthContext)
  console.log(currentUser)
  return (
    <div className='navbar'>
      <span className='logo'>
        Chat
      </span>
      <div className='user'>
        <img src={currentUser?.photoURL} alt=''/>
        <span>{currentUser.displayName}</span>
        <button onClick={()=> signOut(Auth)}>Logout</button>
      </div>
    </div>
  )
}
