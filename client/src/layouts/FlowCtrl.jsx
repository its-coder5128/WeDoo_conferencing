import React, { useEffect, useState } from 'react'
import {Outlet} from 'react-router-dom'
import { useRoom } from '../contexts/RoomContext.jsx';
import { useNavigate } from "react-router";

function BaseLayout(){
    const {throughtTheFlow,socket} = useRoom();
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        return ()=>{
            if(!throughtTheFlow)
            {
                // console.log("leave room func", RoomID);
                socket.emit("leave room");
                setTimeout(()=>{
                    setLoading(true);
                    navigate("/");
                    window.location.reload();
                },"2000")
            }
            else
                setLoading(true);
        }
    },[])
  return (
        <div className=' w-full h-screen'>
            {loading?<Outlet/>:<strong>loading...</strong>}
            
        </div>
  )
}

export default BaseLayout