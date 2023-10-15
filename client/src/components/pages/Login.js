import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({socket}){
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    //this function will send the users info over to the server and then enter the chat room
    function handleLoginSubmit(e){
        e.preventDefault();
        console.log(`Username is: ${userName}`);

        socket.emit('logon', {
            name: userName
          })
        navigate('/chat');
    }

    return(
        <div className="login-header">
            <div className="login-box">
                <form>
                    <input  type="text" 
                            required 
                            name="user_name"
                            value={userName}
                            onChange={(e)=>setUserName(e.target.value)}
                            placeholder="Enter Your Username">

                    </input>
                    <button type="submit" onClick={handleLoginSubmit}>Enter</button>
                </form>
            </div>
        </div>
    )
}
