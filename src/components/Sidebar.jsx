import React from 'react'
import {Search} from '../components/Search'
import {Navbar} from '../components/Navbar'
import { Chats } from './Chats'

export const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Navbar/>
        <Search/>
        <Chats/>
    </div>
  )
}
