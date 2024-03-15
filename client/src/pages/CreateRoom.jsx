import { useState } from "react";
import { useNavigate } from "react-router";
import { useRoom } from "../contexts/RoomContext";

function CreateRoom() {

  const navigate = useNavigate();
  const [rid,setRID] = useState("");

  const {joinRoom,CreateRoom} = useRoom();

  return (
    <div className=" bg-slate-600 w-full h-screen text-white">
        <button className=" bg-blue-500 px-12 py-4 rounded-md m-8" onClick={CreateRoom}>Create Room</button>

        <form onSubmit={(e) => joinRoom(rid,e)}>
          <input value={rid} onChange={(e) => setRID(e.target.value)} className=" px-12 py-4 m-2 text-black"/>
          <button type="submit" className=" bg-blue-500 px-12 py-4 rounded-md m-8"> Join Room</button>
        </form>

    </div>
  );
}

export default CreateRoom;

