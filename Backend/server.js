import express from "express";
import 'dotenv/config';
import cors from "cors";
import chatRoutes from "./routes/chat.js";


import mongoose from "mongoose";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, ()=>{
  console.log(`server running on ${PORT}`)
  connectDB();
});

app.use("/api",chatRoutes);

const connectDB = async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("connected with database !!");
  }catch(err){
    console.log("Failed to connect with db", err);
  }
}


app.use(cors({
  origin: "https://sigmagpt-ai-chat-application.onrender.com", 
  credentials: true
}));

app.get("/", (req, res) => res.send("SigmaGPT Backend is Live!"));