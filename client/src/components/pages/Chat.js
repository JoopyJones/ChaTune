import { useEffect, useState } from "react";

export default function Chat({socket}){
    const [currentUsers, setCurrentUsers] = useState([]);
    const [outBoundMessage, setOutBoundMessage] = useState('');
    const [inBoundMessages, setInboundMessages] = useState([]);

    //functions to handle events from server
    useEffect(()=>{
        //user connected, adding name to list
        socket.on('user_connected', (data)=>{
            setCurrentUsers(data);
        })

        //chat message received from server
        socket.on('inbound_message', (data)=>{
            setInboundMessages((inBoundMessages)=>{
                return [...inBoundMessages, data];
            })
        })

        //user disconnected, removing name from list
        socket.on('user_disconnected', (data)=>{
            setCurrentUsers(data);
        })
    }, [socket])


    //functions to send events to server
    const sendOutboundMessage = function(event){
        event.preventDefault();
        const message = outBoundMessage.trim();

        if(message !== '')
        {
            socket.emit('outbound_message', message);
        }

        setOutBoundMessage('');
    }

    return(
        <div className="chat-header">
            <div className="user-list">
                {currentUsers.map((user) =>{
                    return <p key={user}>{user}</p>
                })}
            </div>
            <div className="chat-input">
                <form onSubmit={sendOutboundMessage}>
                    <input
                            minLength="1"
                            onChange={(event) =>{
                                setOutBoundMessage(event.target.value);
                            }}
                            placeholder="Enter Message"
                            value={outBoundMessage}>
                    </input>
                    <input type="submit" value="Send Message"></input>
                </form>
            </div>
            <div className="chat-messages">
                {inBoundMessages.map((ibMsg) =>{
                        return <pre key={`${ibMsg.timeStamp}|${ibMsg.userName}`}>{ibMsg.message}</pre>
                    })}
            </div>
        </div>
    )
}