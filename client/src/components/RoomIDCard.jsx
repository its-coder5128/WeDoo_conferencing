import React from "react";
import { Clipboard } from "react-feather";

function RoomIDCard({RoomID,clipboardFun,showRoom}) {
  return (
        <div className={`absolute left-2 mb-2 bottom-16 rounded-lg rounded-bl-none h-32 w-64 p-2 bg-slate-300 ${showRoom?" opacity-100":" opacity-0"} duration-200`}>
            <span className=' font-medium'> Room ID </span>
            <div className=' flex justify-around gap-4 items-center px-4 rounded-md border-solid border-2 border-gray-800'>
                <div className=' bg-white w-full text-center rounded-md'>
                    {RoomID}
                </div>
                <div className={`h-16 w-1/12 flex justify-center items-center bg-slate-300`}>
                    <button className=' text-blue-500' onClick={()=>clipboardFun(RoomID)}> 
                        <Clipboard size={32} strokeWidth={1}/> 
                    </button>
                </div>
            </div>
        </div>
  );
}

export default RoomIDCard;

