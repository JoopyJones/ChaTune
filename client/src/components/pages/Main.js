import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//userc components
import ChatSection from "./ChatSection";
import SoundCloudSection from "./SoundCloudSection";

export default function Main({socket}){
    const navigate = useNavigate();
    const [thisUserName, setThisUserName] = useState('');

    //if a user refreshes their page, redirect them to the login screen, since socket.io will disconnect them
    useEffect(()=>{
        
        //is this the first time the page has been loaded?
        if( sessionStorage.getItem('firstPageLoad') !== '1')
        {
            sessionStorage.setItem('firstPageLoad', '1');
        }
        else{
            sessionStorage.setItem('firstPageLoad', '0');
            navigate('/');
        }
    },[])

    //TODO - need to figure out how to only render the components once we have our user name
    // might need to move this into login component? Need to figure out how to wait for socket event..
    useEffect(()=>{
        socket.on('valid_user_name', (data)=>{
            setThisUserName(data.validName);
        })
    },[socket])

    return(
        <div className="main-page-header">
            <section id="soundcloud-section">
                <SoundCloudSection socket={socket}/>
            </section>
            <section id="chat-section">
                <ChatSection socket={socket} thisUserName={thisUserName}/>
            </section>
        </div>
    )
}