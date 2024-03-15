import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router";

const socket = io("http://localhost:4000", {
  autoConnect: false
});

const roomContext = createContext()

export const RoomProvider = ({children}) => {

    const navigate = useNavigate();

    const [me,setMe] = useState("");

    useEffect(()=>{
        socket.connect();
        const settingMe = (id)=>{
            setMe(id);
        }

        socket.on("me", settingMe)

        return () => {
            socket.disconnect();
            socket.off("me", settingMe)
        } 
             
    },[])

    useEffect(() => {
        console.log("me",me);
    },[me])

    const joinRoom = (RoomID,e)=>{
        e.preventDefault();
        console.log("join room func");
        navigate(`/room/${RoomID}`);
    }
    const CreateRoom = () => {
        const RoomID = uuid().slice(0, 8);
        console.log("join room func");
        navigate(`/room/${RoomID}`);
    }
    const leaveRoom = (RoomID)=>{
        console.log("leave room func");
        socket.emit("leave room", RoomID);
        navigate("/");
    }

    const RoomData ={
        me,
        socket,
        joinRoom,
        CreateRoom,
        leaveRoom,
        
    }

    return(
        <roomContext.Provider value={RoomData}>
            {children}
        </roomContext.Provider>
    );
}

export const useRoom = () => { return useContext(roomContext) }
export default roomContext;