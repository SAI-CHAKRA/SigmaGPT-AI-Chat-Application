import "./Chat.css";
import { useContext, useState, useEffect,useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";




function Chat(){


    const {newChat, setNewChat, prevChats, setPrevChats, reply} = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);
    const bottomRef = useRef(null);
    useEffect(() =>{

        if(reply === null){
            setLatestReply(null);
            return;
        }
        // for latestReply we doing seperate => typing effect

        if(!prevChats?.length) return;

        setLatestReply("");   

        const content = reply.split(" ");  // individual words based on spaces
        
        // console.log(content);
        let idx=0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0,idx+1).join(" "));
            idx++;

            if(idx >= content.length) clearInterval(interval);
        }, 80);

        return ()=> clearInterval(interval);

    },[prevChats, reply]);

    // useEffect(() => {
    //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [latestReply, prevChats]);


    return(
        <>
        {/* {console.log("newChat:", newChat)} */}
        {newChat && <h1>Start a New Chat !!</h1>}
        <div className="chats">

            {
                prevChats?.slice(0,-1).map((chat,idx)=>
                    <div className={chat.role === "user"  ?"userDiv":"gptDiv"} key={idx}> 
                        {
                            chat.role === "user"? 
                            <p className="userMsg">{chat.content}</p> : 
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )

            }

            {
                prevChats.length > 0 && (
                    <>
                        {
                            latestReply === null?(
                                <div className="gptDiv" key={"non-typing"}> 
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                                </div>
                            ):(
                                <div className="gptDiv" key={"typing"}> 
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                            )
                        }
                    </>
                )
            }

            {/* <div ref={bottomRef}></div> */}

        </div>
        
        </>
    )
}
export default Chat;
