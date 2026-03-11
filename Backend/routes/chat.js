import express from "express";
import Thread from "../models/Thread.js";
import getOpenRouter_API_Response from "../utils/openRouter.js"

const router = express.Router();

//test
router.post("/test", async(req,res)=>{
    try{
        const thread = new Thread({
            threadId:"xyzz",
            title:"Testing New Thread"
        });
        const response = await thread.save();
        res.send(response);
    } catch(err){
        console.log(err);
        res.status(500).json({error: "failed to save in db"});
    }
});


// get all threads

router.get("/thread",async (req,res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt:-1});
        //decending order of updatedAt... most recent thread top
        res.json(threads);

    } catch(err){
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
});

// get specific thread
router.get("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error:"thread not found"});
        }
        res.send(thread.messages);

    }catch(err){
        console.log(err);
        res.status(500).json({error: "failed to fetch threads"});
    }
});

// delete a thread

router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId} = req.params;
    try{
        const deleteThread = await Thread.findOneAndDelete({threadId});
        if(!deleteThread){
            res.status(404).json({error:"failed to delete the thread"});
        }
        res.status(200).json({success:"thread deleted sucessfully"});

    }catch(err){
        console.log(err);
        res.status(500).json({error: "failed to delete threads"});
    }
});

// chat

router.post("/chat", async(req,res)=>{
    const {threadId,message} = req.body;

    if(!threadId || !message){
        return res.status(400).json({error:"missing field required"});
    }

    try{ 
        let thread = await Thread.findOne({threadId});
        // console.log(thread);
        if(!thread){
            thread = new Thread({
                threadId,
                title:message,
                messages:[{role:"user",content:message}]
            });
        }
        else{
            thread.messages.push({role:"user", content:message});
        }
        const assistantReply = await getOpenRouter_API_Response(message); 

        if (!assistantReply) {
            return res.status(500).json({ error: "AI failed to respond, Error from assistantReply at chat.js" });
        }
        

        thread.messages.push({role:"assistant", content:assistantReply});
        thread.updatedAt = new Date();

        await thread.save();

        res.json({reply:assistantReply});

    }catch(err){
         console.log(err);
        res.status(500).json({error: "failed to post chat"});
    }
});

export default router;