import express from "express";
import cors from "cors";
import { Server } from "socket.io";

const app = express();

const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/",(req,res)=>{
    return res.send("THIS IS BACKEND")
})

const server = app.listen(port,()=>{
    console.log("listening at port", port);
})

const io = new Server(server, {
  cors: {
    origin:[ "http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const users = {};

const socketToRoom = {};

const idToName = {};

io.on("connection", (socket) => {
    
  console.log("user connected", socket.id)

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
      console.log("user disconnected",socket.id);
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
          room = room.filter(id => id !== socket.id);
          users[roomID] = room;
      }
      socket.to(room).emit("user left", socket.id);
  });
    
    socket.on('disconnecting', () => {
        var rooms = socket.rooms;
        
        rooms.forEach(function(room){
            if(room != socket.id){
                socket.to(room).emit("user disconnected", socket.id);
            }
        });
        
  });

  socket.on("leave room", () => {
    const RoomID = socketToRoom[socket.id];
    socket.leave(RoomID);
    console.log("leave");

    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
        room = room.filter(id => id !== socket.id);
        users[roomID] = room;
    }
    socket.to(room).emit("user left", socket.id);

    socket.to(RoomID).emit("user disconnected", socket.id);
    console.log("user disconnected", RoomID);
  })

  socket.on("join room", ({RoomID,name}) => {
    idToName[socket.id] = name;
    socket.to(RoomID).emit("new user", socket.id);
    if (users[RoomID]) {
      const length = users[RoomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
        users[RoomID].push(socket.id);
    } else {
      users[RoomID] = [socket.id];
    }
    socket.join(RoomID);
    console.log("join");
    socketToRoom[socket.id] = RoomID;
    
    const usersInThisRoom = users[RoomID].filter(id => id !== socket.id);

    socket.emit("all users", {usersInThisRoom,idToName});
  })
  
  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, name: idToName[socket.id] });
  });

  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on("msg",(data)=>{
    console.log("msg");
    io.to(data.room).emit("msg", data.data);
  })
  
});
