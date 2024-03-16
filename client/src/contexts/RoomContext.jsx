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
    const [alert,setAlert] = useState("");
    const [ isAlertVisible, setIsAlertVisible ] = useState(false);

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
        console.log("leave room func", RoomID);
        socket.emit("leave room", RoomID);
        navigate("/");
    }
    const newUserConnected = (id) => {
        console.log("new user joined the room", id);
        setIsAlertVisible(true);
        const msg = `new user joined the room ${id}`;
        setAlert(msg);

        setTimeout(() => {
            setIsAlertVisible(false);
            setAlert("");
        }, "2000");
            
    };
    const userDisconnected = (id) => {
        console.log("user disconnected", id);
        setIsAlertVisible(true);
        const msg = `User disconnected ${id}`;
        setAlert(msg);
    
        setTimeout(() => {
            setIsAlertVisible(false);
            setAlert("");
        }, "2000");
    };
    const clipboardFun = (RoomID) => {
        navigator.clipboard.writeText(RoomID);
        console.log("Copied to Clipboard");
        setIsAlertVisible(true);
        const msg = "Copied to Clipboard";
        setAlert(msg);
    
        setTimeout(() => {
            setIsAlertVisible(false);
            setAlert("");
        }, "2000");
    }

    const RoomData ={
        me,
        socket,
        isAlertVisible,
        alert,
        joinRoom,
        CreateRoom,
        leaveRoom,
        newUserConnected,
        userDisconnected,
        clipboardFun
        
    }

    return(
        <roomContext.Provider value={RoomData}>
            {children}
        </roomContext.Provider>
    );
}

export const useRoom = () => { return useContext(roomContext) }
export default roomContext;