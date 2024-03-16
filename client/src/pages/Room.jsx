import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom';
import { useRoom } from '../contexts/RoomContext.jsx';
import ChatBox from '../components/ChatBox.jsx';
import Alert from '../components/Alert.jsx';
import RoomIDCard from '../components/RoomIDCard.jsx';
import BottomBar from '../components/BottomBar.jsx';

function Room() {
    const {RoomID} = useParams();
    const {isAlertVisible,alert,socket,leaveRoom,userDisconnected,newUserConnected,clipboardFun} = useRoom();

    const [chat,setChat] = useState(false);
    const [showRoom,setShowRoom] = useState(false);
   
    useEffect(() => {
        socket.on("new user", newUserConnected);
        socket.on("user disconnected",userDisconnected);
        socket.emit("join room", RoomID);
        
        return ()=>{
            socket.off("new user", newUserConnected);
            socket.off("user disconnected",userDisconnected);
        }
    },[])

    

    return (
        <div className=' w-full h-screen flex overflow-hidden duration-200'>
            <RoomIDCard RoomID={RoomID} clipboardFun={clipboardFun} showRoom={showRoom}/>
            {isAlertVisible && <Alert message={alert}/> }
            
            <div className=' bg-slate-800 w-full h-screen flex flex-col items-center justify-center '>
                
                <div className=' w-full h-screen p-2 rounded-lg'>
                    <div className=' bg-black w-full h-full rounded-lg overflow-hidden'>

                    </div> 
                </div>
                
                <BottomBar RoomID={RoomID} showRoom={showRoom} setChat={setChat} setShowRoom={setShowRoom}/>

            </div>
            <ChatBox chat = {chat} rid = { RoomID }/>
            
            
        </div>
    );
}

export default Room;
