import React, { useEffect, useState,useRef } from 'react'
import { v4 as uuid } from "uuid";
import {useParams} from 'react-router-dom';
import { useRoom } from '../contexts/RoomContext.jsx';
import ChatBox from '../components/ChatBox.jsx';
import Alert from '../components/Alert.jsx';
import RoomIDCard from '../components/RoomIDCard.jsx';
import BottomBar from '../components/BottomBar.jsx';
import Video from '../components/Video.jsx';


function Room() {
    const {RoomID} = useParams();
    const {throughtTheFlow,name,createPeer,addPeer,isAlertVisible,alert,socket,userDisconnected,newUserConnected,clipboardFun} = useRoom();

    const [chat,setChat] = useState(false);
    const [idToName,setIdToName] = useState({});
    const [showRoom,setShowRoom] = useState(false);
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState({});
    const [audio,setAudio] = useState(true);
    const [video,setVideo] = useState(true);

    const userVideo = useRef();
    const inititalise = useRef(false);
    const peersRef = useRef([]);

    useEffect(()=>{
        console.log("peers",peers);
    },[peers])

    const videoConstraints = {
        height: window.innerHeight / 2,
        width: window.innerWidth / 2
    };

   
    useEffect(() => {
        socket.on("new user", newUserConnected);
        socket.on("user disconnected",userDisconnected);
        
        if(!inititalise.current && throughtTheFlow)
        {
            inititalise.current = true;
            navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
                setStream(stream);
                if(userVideo.current)
                    userVideo.current.srcObject = stream;
                socket.emit("join room", {RoomID,name});
                socket.on("all users", ({usersInThisRoom,idToName}) => {
                    setIdToName(idToName);
                    const peers = [];
                    usersInThisRoom.forEach(userID => {
                        console.log("uID",userID);
                        const peer = createPeer(userID, socket.id, stream);
                        peersRef.current.push({
                            name : idToName[userID],
                            peerID: userID,
                            peer,
                        })
                        peers.push({
                            name : idToName[userID],
                            peerID: userID,
                            peer});
                        })
                        setPeers(peers);
                    })
                    
                    socket.on("user joined", payload => {
                        const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        name : payload.name,
                        peerID: payload.callerID,
                        peer,
                    })
                    const peerObj = {
                        name : payload.name,
                        peerID: payload.callerID,
                        peer
                    }
                    setPeers(users => [...users, peerObj]);
                });
    
                socket.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                });

                socket.on("user left",(id) => {
                    const item = peersRef.current.find(p => p.peerID === id);
                    if(item){
                        item.peer.destroy();
                    }
                    const peer = peersRef.current.filter(p => p.peerID !== id);
                    peersRef.current = peer;
                    setPeers(peer);
                })
            })
        }

        
        return ()=>{
            socket.off("new user", newUserConnected);
            socket.off("user disconnected",userDisconnected);
        }
    },[])

    const toggleVid = () => {
        setVideo(prev => !prev);
        const userStream = stream;
        const vidTrack = userStream.getTracks().find(track => track.kind === 'video');
        vidTrack.enabled = !vidTrack.enabled;
        setStream(userStream);
    }
    const toggleAudio = () => {
        setAudio(prev => !prev);
        const userStream = stream;
        const audioTrack = userStream.getTracks().find(track => track.kind === 'audio');
        audioTrack.enabled = !audioTrack.enabled;
        setStream(userStream);
    }

    return (
        <div className=' w-full h-screen flex overflow-hidden duration-200'>
            <RoomIDCard RoomID={RoomID} clipboardFun={clipboardFun} showRoom={showRoom}/>
            {isAlertVisible && <Alert message={alert}/> }
            
            <div className=' bg-slate-800 w-full h-screen flex flex-col items-center justify-center '>
                
                <div className=' w-full h-full p-2 rounded-lg'>
                    <div className=' bg-slate-700 p-2 w-full h-full rounded-lg overflow-hidden'>
                        <div className=' h-full w-full flex flex-wrap justify-around items-center'>
                            <div className=' w-full max-w-lg h-1/2 p-2 '>
                                <span className=' font-bold px-2 rounded-lg bg-slate-400 text-lg text-gray-800 z-10 absolute translate-y-8 translate-x-8'>You</span>
                                {stream && (    
                                            <video
                                                className=" h-full w-full rounded-lg -scale-x-100"
                                                playsInline
                                                muted
                                                ref={userVideo}
                                                autoPlay
                                            />
                                            )}
                            </div>
                            {
                                peers.map((peer) => (
                                    <Video key={peer.peerID} peer={peer.peer} name={peer.name} />
                                ))
                            }
                            
                        </div>
                    </div> 
                </div>

                <BottomBar audio={audio} video={video} toggleAudio={toggleAudio} toggleVid={toggleVid} peersRef={peersRef} RoomID={RoomID} showRoom={showRoom} setChat={setChat} setShowRoom={setShowRoom}/>

            </div>
            <ChatBox chat = {chat} rid = { RoomID }/>
            
            
        </div>
    );
}

export default Room;
