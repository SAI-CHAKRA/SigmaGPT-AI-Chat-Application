import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {v1 as uuidv1} from "uuid";


import chatGPTIcon from "./assets/chatgpt_PNG16.png";


function Sidebar(){

    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId , setPrevChats} = useContext(MyContext);

    const getAllThreads = async()=>{
        try{
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();

            const filterData = res.map(thread =>({
                threadId:thread.threadId, 
                title:thread.title
            }));
            setAllThreads(filterData);
            // console.log(filterData);
        }   
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getAllThreads();
    },[currThreadId]);

    const createNewChat = () =>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv1());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId)=>{
        setCurrThreadId(newThreadId);
        try{
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();

            // console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        }
        catch(err){
            console.log(err);
        }

    }

    const deleteThread = async (threadId)=>{
        try{
            const response = await fetch(`https://sigmagpt-ai-chat-application.onrender.com/api/thread/${threadId}`, {method:"DELETE"});
            const res = await response.json();
            console.log(res);

            // update threads re-render all threads

            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === currThreadId){
                createNewChat();
            }
        }
        catch(err){
            console.log(err);
        }
    }

    return(
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src={chatGPTIcon} alt="gpt logo" className="logo"></img>
                <span><i className="fa-regular fa-pen-to-square"></i></span>
            </button>

            {/* history */}
            
            <ul className="history">
                {
                    allThreads?.map((thread)=>(
                        <li 
                        key={thread.threadId} 
                        onClick={(e)=>{changeThread(thread.threadId)}}
                        className={thread.threadId === currThreadId ? "highlighted":" "}
                        >
                            {thread.title}
                            <i 
                            className="fa-solid fa-trash"
                            onClick={(e)=>{
                                e.stopPropagation();            // Wrote in notes
                                deleteThread(thread.threadId);
                            }}
                            ></i>
                        </li>
                    ))
                }
            </ul>

            {/* sign in */}
            <div className="sign">
                <p> THOTA SAI CHAKRA </p>
            </div>
        </section>
    )
}

export default Sidebar;