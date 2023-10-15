import { useEffect, useState } from "react";

export default function Chat({socket}){
    const [currentUsers, setCurrentUsers] = useState([]);


    useEffect(()=>{
        socket.on('user_connected', (data)=>{
            //console.log(`user ${data.name} connected`);
    
            setCurrentUsers(data.names);
        })
    },[socket, currentUsers])

    console.log(currentUsers);
    return(
        <div className="chat-header">
            {currentUsers.map((user) =>{
                return <p key={user}>{user}</p>
            })}
        </div>
    )
}