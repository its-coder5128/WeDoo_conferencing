import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import { Server } from "socket.io";
import http from 'http';
import path from 'path';

dotenv.config();
const app = express();

const port = process.env.PORT || 4000;

app.use(cors({
  origin: "https://we-doo-conferencing-client.vercel.app",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const __dirname1 = path.resolve();
if(process.env.NODE_ENV === "production")
{
  app.use(express.static(path.join(__dirname1,"../client/build")));
  app.get("*",(req,res) => {
    res.sendFile(path.resolve(__dirname1,"../client/build/index.html"));
  })
}
else{
    app.get("/",(req,res)=>{
        return res.send("THIS IS BACKEND")
    })
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://we-doo-conferencing-client.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  },
});

const users = {};
const socketToRoom = {};
const idToName = {};

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
      const roomID = socketToRoom[socket.id];
      let room = users[roomID];
      if (room) {
          room = room.filter(id => id !== socket.id);
          users[roomID] = room;
      }
      socket.to(roomID).emit("user left", socket.id);
  });
    
  socket.on('disconnecting', () => {
    const rooms = Object.keys(socket.rooms);
    rooms.forEach(room => {
      if(room != socket.id){
          socket.to(room).emit("user disconnected", socket.id);
      }
    });
  });

  socket.on("leave room", () => {
    const roomID = socketToRoom[socket.id];
    socket.leave(roomID);

    let room = users[roomID];
    if (room) {
        room = room.filter(id => id !== socket.id);
        users[roomID] = room;
    }
    socket.to(roomID).emit("user left", socket.id);
    socket.to(roomID).emit("user disconnected", socket.id);
  });

  socket.on("join room", ({ RoomID, name }) => {
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

    socket.emit("all users", { usersInThisRoom, idToName });
  });
  
  socket.on("sending signal", payload => {
    io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID, name: idToName[socket.id] });
  });

  socket.on("returning signal", payload => {
    io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
  });

  socket.on("msg", (data) => {
    io.to(data.room).emit("msg", data.data);
  });
});

server.listen(port, () => {
  console.log("listening at port", port);
});
