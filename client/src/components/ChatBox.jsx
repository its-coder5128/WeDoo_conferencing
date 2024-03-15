import { useState,useEffect } from "react";
import { useRoom } from "../contexts/RoomContext";
import { Send } from 'react-feather'

function ChatBox({chat,rid}) {

    const {socket,me} = useRoom();
    
    const [msgToSend,setMsgToSend] = useState("");
    const [messages,setMessages] = useState([]);

    useEffect(() => {
        const SendMessage = (data)=>{
            const msgData = {id : data.id, message: data.msg};

            setMessages(prev => [msgData,...prev]);
        }

        socket.on("msg",SendMessage);
        
        return ()=>{
            socket.off("msg",SendMessage);
        }
    },[])
    
    const msg = (e,message)=>{
        e.preventDefault();
        if(msgToSend.length>0)
        {
            socket.emit("msg",{room: rid,data: {id:me,msg:message}});  
            setMsgToSend("");
        }
    }
    const EnterPress = (e) => {
        if (e.keyCode == 13 && e.shiftKey == false) {
            msg(e,msgToSend);
        }
    }
    return (
        <div className={` py-2 h-screen ${chat? " w-72 " : " w-0"} duration-500`}>
            <div className=" flex flex-col bg-slate-400 h-full w-full text-gray-900 rounded-lg overflow-hidden ">
                <div className=" w-full p-2">
                    <small className="font-medium">Message</small>
                    <form
                        onSubmit={(e) => msg(e,msgToSend)}
                        className=" w-full h-12 flex justify-center items-center rounded-lg overflow-hidden"> 
                        <textarea 
                            rows={3} 
                            onKeyDown={EnterPress}
                            className=" w-full h-full outline-none px-2 text-sm" 
                            value={msgToSend} 
                            onChange={(e)=>setMsgToSend(e.target.value)}/>
                        <button type="submit" className={` px-2 h-full flex justify-center items-center bg-white ${msgToSend.length>0 ? "text-blue-500" : "text-blue-200"} hover:text-blue-700 duration-200`}><Send size={12} strokeWidth={2}/></button>
                    </form>
                </div>
                <hr className=" h-px mx-auto bg-gray-500 border-0 w-10/12"></hr>
                <div className=" p-2 overflow-scroll overflow-x-hidden h-full text-sm">
                    <ul>
                        {
                            messages.map((data,index) => (
                                <li key={index} className={` mb-1 flex flex-col ${data.id === me ? " items-end":" items-start"}`}>
                                    <div className={` bg-orange-800 text-gray-300 font-medium max-w-40 overflow-hidden rounded-lg px-4 py-1`}>
                                        <div className="overflow-hidden">
                                            <small >
                                                {data.message}
                                            </small>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ChatBox;

