import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom';
import { useRoom } from '../contexts/RoomContext.jsx';
import { useNavigate } from "react-router";
import ChatBox from '../components/ChatBox.jsx';
import { MessageSquare, Menu, Clipboard } from 'react-feather'

function Room() {
    const {RoomID} = useParams();
    const {socket,leaveRoom} = useRoom();
    const navigate = useNavigate();

    const [chat,setChat] = useState(false);
    const [showRoom,setShowRoom] = useState(false);
  
    useEffect(() => {
        const newUserConnected = (id) => {
            console.log("new user joined the room", id);
        };
        const userDisconnected = (id) => {
            console.log("user disconnected", id);
        };

        socket.on("new user", newUserConnected);
        socket.on("user disconnected",userDisconnected);
        socket.emit("join room", RoomID);
        
        return ()=>{
            socket.off("new user", newUserConnected);
            socket.off("user disconnected",userDisconnected);
        }
    },[])

    const clipboardFun = () => {
        navigator.clipboard.writeText(RoomID);
        alert("Copied to Clipboard");
    }

    return (
        <div className=' w-full h-screen flex overflow-hidden duration-200'>
            <div className={`absolute left-2 mb-2 bottom-16 rounded-lg rounded-bl-none h-32 w-64 p-2 bg-slate-300 ${showRoom?" opacity-100":" opacity-0"} duration-200`}>
                <span className=' font-medium'> Room ID </span>
                <div className=' flex justify-around gap-4 items-center px-4 rounded-md border-solid border-2 border-gray-800'>
                    <div className=' bg-white w-full text-center rounded-md'>
                        {RoomID}
                    </div>
                    <div className={`h-16 w-1/12 flex justify-center items-center bg-slate-300`}>
                        <button className=' text-blue-500' onClick={clipboardFun}> 
                            <Clipboard size={32} strokeWidth={1}/> 
                        </button>
                    </div>
                </div>
                
            </div>
            <div className=' bg-slate-800 w-full h-screen flex flex-col items-center justify-center '>
                
                <div className=' w-full h-screen p-2 rounded-lg'>
                    <div className=' bg-black w-full h-full rounded-lg overflow-hidden'>

                    </div>
                    
                </div>
                <div className='flex justify-center items-center h-16 w-full mb-2 p-2'>
                    <div className={`h-16 w-1/12 flex justify-center items-center ${showRoom?"bg-slate-300":"bg-slate-800"} duration-200`}>
                        <button className={`p-2 hover:text-blue-500 ${showRoom?"text-blue-500":"text-blue-200"}`} onClick={() => setShowRoom(prev => !prev)}> 
                            <Menu size={32} strokeWidth={1}/> 
                        </button>
                    </div>
                    <div className=' h-16 w-10/12'></div>
                    <div className=' h-16 w-1/12 flex justify-center items-center '>
                        <button className=' p-2 text-blue-200 hover:text-blue-500 duration-200' onClick={() => setChat(prev => !prev)}> 
                            <MessageSquare size={32} strokeWidth={1}/> 
                        </button>
                    </div>
                </div>

            </div>
            <ChatBox chat = {chat} rid = { RoomID }/>
            
            
        </div>
    );
}

export default Room;
