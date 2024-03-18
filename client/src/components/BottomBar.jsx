import React from "react";
import { MessageSquare,Menu,Phone,Mic,MicOff,Video,VideoOff } from "react-feather";
import { useRoom } from '../contexts/RoomContext.jsx';

function BottomBar({peersRef,audio,video,toggleAudio,toggleVid,RoomID,showRoom,setShowRoom,setChat}) {

    const { leaveRoom } = useRoom();


    return (
        <div className='flex justify-center items-center h-16 w-full mb-2 p-2'>
            <div className={`h-16 w-1/12 flex justify-center items-center ${showRoom?"bg-slate-300":"bg-slate-800"} duration-200`}>
                <button className={`p-2 hover:text-blue-500 ${showRoom?"text-blue-500":"text-blue-200"}`} onClick={() => setShowRoom(prev => !prev)}> 
                    <Menu size={32} strokeWidth={1}/> 
                </button>
            </div>
            <div className=' h-16 w-10/12 flex justify-around items-center'>
                <div className=' h-16 w-1/2 flex justify-around items-center'>
                    <button className={`p-2 hover:text-blue-500 ${showRoom?"text-blue-500":"text-blue-200"}`} onClick={toggleVid}> 
                        {video?<Video size={32} strokeWidth={1}/>:<VideoOff size={32} strokeWidth={1}/>} 
                    </button>
                    <button className={`p-2 hover:text-blue-500 ${showRoom?"text-blue-500":"text-blue-200"}`} onClick={toggleAudio}> 
                        {audio?<Mic size={32} strokeWidth={1}/>:<MicOff size={32} strokeWidth={1}/>} 
                    </button>
                    <button className={`p-2 bg-red-700 rounded-full hover:bg-red-800 text-red-200`} onClick={() => leaveRoom(RoomID)}> 
                        <Phone size={32} strokeWidth={1}/> 
                    </button>
                </div>
            </div>
            <div className=' h-16 w-1/12 flex justify-center items-center '>
                <button className=' p-2 text-blue-200 hover:text-blue-500 duration-200' onClick={() => setChat(prev => !prev)}> 
                    <MessageSquare size={32} strokeWidth={1}/> 
                </button>
            </div>
        </div>
    );
}

export default BottomBar;

