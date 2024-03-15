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

io.on("connection", (socket) => {
    
  console.log("user connected", socket.id)

  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
      console.log("user disconnected",socket.id);
    });
    
    socket.on('disconnecting', () => {
        var rooms = socket.rooms;
        
        rooms.forEach(function(room){
            if(room != socket.id){
                socket.to(room).emit("user disconnected", socket.id);
            }
        });
        
  });

  socket.on("leave room", (RoomID) => {
    socket.leave(RoomID);
    console.log("leave");
    socket.to(RoomID).emit("user disconnected", socket.id);
  })

  socket.on("join room", (RoomID) => {
    socket.join(RoomID);
    console.log("join");
    socket.to(RoomID).emit("new user", socket.id);
  })

  socket.on("msg",(data)=>{
    console.log("msg");
    io.to(data.room).emit("msg", data.data);
  })
  
});
