import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useEffect, useState } from "react";
import {ScaleLoader} from "react-spinners";

function ChatWindow(){
    const {prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats, newChat, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const getReply = async () =>{
        // console.log("prompt", prompt, "threadId: ", currThreadId);
        setLoading(true);
        setNewChat(false);
        const options = {
            method:"POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: currThreadId
            })
        };
        try{
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            console.log(res);
            setReply(res.reply);
        }
        catch(err){
            console.log(err);
        }
        setLoading(false);
      
    }
    //Append new chat to prev chats
    useEffect(()=>{
        if(prompt && reply){
            setPrevChats(prevChats => (
                [...prevChats,
                    {
                        role:"user",
                        content:prompt
                    },
                    {
                        role:"assistant",
                        content:reply
                    }
                ]
            ));
        }
        setPrompt("");
    },[reply]);

    const handleProfleClick =()=>{
        setIsOpen(!isOpen);
    }
    
    return( 


        <div className="chatWindow">

            <div className="navbar">
                <span>SigmaGPT <i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfleClick}>
                    <span className="userIcon"><i className="fa-solid fa-user"></i></span>
                </div>
            </div>
            {
                isOpen && 
                <div className="dropDown">
                    
                    <div className="dropDownItem"> <i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItem"> <i class="fa-solid fa-cloud-arrow-up"></i> Upgrade Plan </div>
                    <div className="dropDownItem"> <i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                    
                </div>
            }

            <Chat></Chat>

            <ScaleLoader color="#fff" loading={loading}>
            </ScaleLoader>

            <div className="chatInput">
                <div className="inputBox">
                    <input type="text" placeholder="Ask anything" 
                    value={prompt} 
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e)=>(e.key === 'Enter' && prompt.trim()) ? getReply() : ''}
                    ></input>

                    <div id="submit" onClick={getReply}><i className="fa-regular fa-paper-plane"></i></div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important Info. Check cookie preferences.
                </p>
            </div>
        </div>
    )
};

export default ChatWindow; 