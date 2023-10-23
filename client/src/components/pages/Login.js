import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({socket}){
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    //this function will send the users info over to the server and then enter the chat room
    function handleLoginSubmit(e){
        e.preventDefault();
        if(userName){

            socket.emit('logon', {
                name: userName
            });
            
            navigate('/chat');
        }
    }

    return(
        <div className="login-header">
            <div className="login-box">
                <h1>Please Login</h1>
                <form>
                    <input  
                            autoFocus
                            minLength="1"
                            name="user_name"
                            onChange={(e)=>setUserName(e.target.value)}
                            placeholder="Enter Your Username"
                            required 
                            value={userName}>

                    </input>
                    <button type="submit" onClick={handleLoginSubmit}>Enter</button>
                </form>
            </div>
        </div>
    )
}
