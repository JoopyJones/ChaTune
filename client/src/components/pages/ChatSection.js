import { useEffect, useState } from 'react';

//user components
import ChatWindow from './ChatWindow';
import UserList from './UserList';

export default function ChatSection({socket, thisUserName}){

    return(
    <div className="chat-section-header">
        <UserList socket={socket} thisUserName={thisUserName}/>
        <ChatWindow socket={socket} thisUserName={thisUserName}/>
    </div>
    )
}