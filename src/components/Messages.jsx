import { doc, onSnapshot } from 'firebase/firestore'
import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatContext'
import { db } from '../firebase'
import Message from './Message'

export const Messages = () => {
  const {data} = useContext(ChatContext)
  const [messages,setMessages] = useState([])

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,"chats",data.chatId),(doc)=>{
      if(doc.exists()){
        setMessages(doc.data().messages)
      }else{
        setMessages([])
      }
    })
    return () =>{
      unsub()
    }
  },[data.chatId])

  return (
    <div className='messages'>
    {
      messages.map((m)=>{
        return(
          <Message message={m} key={m.id}/>
        )
      })
    }
    </div>
  )
}
