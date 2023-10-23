import { useState, useEffect } from "react";

export default function UserList({socket, thisUserName}){
    const [currentUsers, setCurrentUsers] = useState([]);

    //functions to handle events from server
    useEffect(()=>{
        //user connected, adding name to list
        socket.on('user_connected', (data)=>{
            setCurrentUsers(data);
        })

        //user disconnected, removing name from list
        socket.on('user_disconnected', (data)=>{
            setCurrentUsers(data);
        })
    }, [socket])

    return(
            <div className="userlist-header">
                {currentUsers.map((user) =>{
                            return <p className= {thisUserName === user ? "user-name color-current-user" : "user-name color-other-users"} key={user}>{user}</p>
                        })}
            </div>)
}