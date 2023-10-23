import { useEffect, useState, useRef } from "react";

export default function ChatWindow({socket, thisUserName}){
    const [outBoundMessage, setOutBoundMessage] = useState('');
    const [inBoundMessages, setInboundMessages] = useState([]);
    
    const chatAnchor = useRef();

    console.log(thisUserName);

    //functions to handle events from server
    useEffect(()=>{
        //chat message received from server
        socket.on('inbound_message', (data)=>{
            setInboundMessages((inBoundMessages)=>{
                return [...inBoundMessages, data];
            })
        })
    }, [socket])

    //this allows us to autoscroll chat to newest message
    useEffect(()=>{
        chatAnchor.current?.scrollIntoView();
    }, [inBoundMessages])

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
        <div className="chatWindow-header">
            <div className="chat-messages">
                {/* if server message, remove the username and the color span. only user messages get those */}
                {inBoundMessages.map((ibMsg) =>{
                        return ibMsg.userName === 'SERVER' ? <pre key={`${ibMsg.timeStamp}|${ibMsg.userName}`}>({ibMsg.timeStamp}) {ibMsg.message}</pre>
                        :
                        <pre key={`${ibMsg.timeStamp}|${ibMsg.userName}`}><span className={ibMsg.userName === thisUserName ? "color-current-user" : "color-other-users"}>({ibMsg.timeStamp}) | {ibMsg.userName}: </span>{ibMsg.message}</pre>
                    })}
                <div className="chat-anchor" ref={chatAnchor}></div>
            </div>
            <div className="chat-input">
                <form onSubmit={sendOutboundMessage}>
                    <input
                            autoFocus
                            minLength="1"
                            onChange={(event) =>{
                                setOutBoundMessage(event.target.value);
                            }}
                            placeholder="Enter Message"
                            value={outBoundMessage}>
                    </input>
                </form>
            </div>
        </div>
    )
}