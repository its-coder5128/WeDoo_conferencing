import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRoom } from "../contexts/RoomContext";
import WeDoo from "../WeDoo.png"
import WeDooLite from "../WeDoo_lite.png"

function CreateRoom() {
  const [rid,setRID] = useState("");
  const [name,setName] = useState("");
  const [err,setErr] = useState(false);

  const {joinRoom,CreateRoom} = useRoom();

  const cRoom = () =>{
    if(name.length >= 1)
    {
      CreateRoom(name);
    }
    else{
      setErr(true);
    }
  }

  const jRoom = (e) => {
    if(name.length >=1){
      joinRoom(rid,name,e);
    }
    else
      e.preventDefault();
      setErr(true);
  }

  return (
    <div className=" w-full min-h-screen flex flex-col bg-slate-300">
        <header className=" w-full bg-slate-800">
          <img className=" h-24" src={WeDooLite} alt="logo" class=" p-0 m-0 scale-50" />
        </header>
        
        <div className=" flex flex-col justify-center items-center max-w-xl mx-auto my-auto">
          {err?<span className=" text-red-600">Please Enter the Name</span>:null}
          <div className=" w-1/2">
            <div>
                <input value={name} placeholder="Enter Name" type="text" id="name" onChange={(e) => setName(e.target.value)} 
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full px-12 py-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <button className=" mt-4 w-full text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-12 py-4 text-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800" onClick={cRoom}>Create Room</button>
          </div>
          <span className=" m-4">- - - - - or - - - - -</span>
          <form onSubmit={jRoom} >
            <div className=" rounded-md overflow-hidden">
              <input value={rid} placeholder="Enter Room" onChange={(e) => setRID(e.target.value)} className=" px-12 py-4  bg-gray-50 text-gray-900  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
              <button type="submit" className=" bg-blue-500 hover:bg-blue-600 text-slate-200 px-12 py-4"> Join Room</button>
            </div>
          </form>
        </div>

        <footer className="bg-white w-full shadow dark:bg-slate-800 mt-auto">
            <div className="w-full max-w-screen-xl mx-auto p-2 md:py-4">
                <div class="flex items-center justify-between">
                    <div className="mb-2 sm:mb-0">
                        <img className=" h-24" src={WeDooLite} alt="logo" class=" p-0 m-0 scale-50" />
                    </div>
                    <ul className="flex flex-wrap items-center mb-2 ml-8 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">About</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                    <div></div>
                </div>
                <hr className="my-4 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-4" />
                <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <span className="hover:underline">WeDoo Conferencing™</span>. All Rights Reserved.</span>
            </div>
        </footer>

    </div>
  );
}

export default CreateRoom;

