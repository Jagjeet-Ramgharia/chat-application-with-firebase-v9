import React, { useContext } from 'react';
import { Messages } from './Messages';
import { Input } from './Input';
import { ChatContext } from '../context/ChatContext';

export const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className='chat'>
      <div className='chatInfo'>
        <span>{data.user?.displayName}</span>
        <div className='chatIcons'>
          <img src='' alt='' />
          <img src='' alt='' />
          <img src='' alt='' />
        </div>
      </div>
      <Messages />
      <Input />
    </div>
  );
};
