import React, { useRef, useEffect, useState } from "react";

function Video({peer,name}) {
    const ref = useRef();
    const [stream,setStream] = useState({});
    useEffect(() => {
        peer.on("stream", st => {
            setStream(st);
            if(ref.current && st)
                ref.current.srcObject = st;
        })
    }, []);
    return (
        <div className=' w-full max-w-lg h-1/2 p-2'>
            <span className=' font-bold px-2 rounded-lg bg-slate-400 text-lg text-gray-800 z-10 absolute translate-y-8 translate-x-8'>{name}</span>
            {stream && <video
                className=" w-full h-full"
                playsInline
                ref={ref}
                autoPlay
            />}
            
        </div>
    );
}

export default Video;

