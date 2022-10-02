import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import {FaLaughBeam} from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'
import { Auth } from '../firebase'
import './style.scss'

export const Login = () => {
  const [err,setError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async(e) =>{
    e.preventDefault()
    const email = e.target[0].value
    const password = e.target[1].value
    try {
      await signInWithEmailAndPassword(Auth,email,password)
      navigate("/")
    } catch (error) {
      setError(true)
    }
    
  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>
        <span className='logo'>Login</span>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="email" placeholder='email'/>
          <input type="password" placeholder='password'/>
          <button>Login</button>
        </form>
        <p>You don't have an account? <Link to="/register">Register</Link> </p>
      </div>
    </div>
  )
}
