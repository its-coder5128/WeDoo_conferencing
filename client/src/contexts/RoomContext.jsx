import { createContext, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router";
import Peer from "simple-peer";

const socket = io("https://wedoo-conferencing.onrender.com/", {
    autoConnect: false,
    withCredentials: true,
});

const roomContext = createContext()

export const RoomProvider = ({children}) => {

    const navigate = useNavigate();


    const [name,setName] = useState("User");
    const [throughtTheFlow,setThroughtTheFlow] = useState(false);
    const [me,setMe] = useState("");
    const [alert,setAlert] = useState("");
    const [ isAlertVisible, setIsAlertVisible ] = useState(false);

    
    useEffect(()=>{
        const settingMe = (id)=>{
            setMe(id);
        }
        const roomFull = ()=>{
            setIsAlertVisible(true);
            const msg = `Room Full`;
            setAlert(msg);

            setTimeout(() => {
                setIsAlertVisible(false);
                setAlert("");
                navigate("/");
            }, "2000");
        }

        socket.connect();
        socket.on("me", settingMe)
        socket.on("room full",roomFull);
        return () => {
            socket.disconnect();
            socket.off("me", settingMe)
            socket.off("room full",roomFull);
        } 
             
    },[])


    const joinRoom = (RoomID,name,e)=>{
        e.preventDefault();
        setThroughtTheFlow(true);
        setName(name);
        navigate(`/room/${RoomID}`);
    }
    const CreateRoom = (name) => {
        setThroughtTheFlow(true);
        setName(name);
        const RoomID = uuid().slice(0, 8);
        navigate(`/room/${RoomID}`);
    }
    const leaveRoom = (RoomID)=>{
        socket.emit("leave room");
        navigate("/");
        window.location.reload();
    }
    const newUserConnected = (id) => {
        setIsAlertVisible(true);
        const msg = `new user joined the room ${id}`;
        setAlert(msg);

        setTimeout(() => {
            setIsAlertVisible(false);
            setAlert("");
        }, "2000");
            
    };
    const userDisconnected = (id) => {
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
        setIsAlertVisible(true);
        const msg = "Copied to Clipboard";
        setAlert(msg);
    
        setTimeout(() => {
            setIsAlertVisible(false);
            setAlert("");
        }, "2000");
    }
    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
        });

        peer.on("signal", signal => {
            socket.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        })

        peer.on("signal", signal => {
            socket.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }
    const myName = (info) => {
        setName(info);
    }
    
    const RoomData ={
        me,
        name,
        socket,
        isAlertVisible,
        alert,
        throughtTheFlow,
        myName,
        addPeer,
        createPeer,
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