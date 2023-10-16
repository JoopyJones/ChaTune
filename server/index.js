//example: https://github.com/machadop1407/socket-io-react-example/tree/main

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const socketListener = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//stores all connected users by (socket.id, name)
var connectedUsers = new Map();

const defaultRoom = 333;

socketListener.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('logon', (data) => {
    console.log(`User Logged On: ${socket.id}`);
    const timeStamp = getCurrentTime();

    //add new user to user list
    connectedUsers.set(socket.id,data.name);
    socket.join(defaultRoom);

    //send new updated user list to front end
    socketListener.to(defaultRoom).emit('user_connected', Array.from(connectedUsers.values()).sort());
    socketListener.to(defaultRoom).emit('inbound_message',  {timeStamp, user_name: 'SERVER', message: `User ${data.name} has joined the chat`});

  })

  socket.on('outbound_message', (message) =>{
    console.log(`Message Sent By: ${socket.id}`);

    //get the current users name
    const currentUserName = connectedUsers.get(socket.id);
    const timeStamp = getCurrentTime();

    //send message to all sockets {time, name, message}
    socketListener.to(defaultRoom).emit('inbound_message',  {timeStamp, user_name: currentUserName, message: `(${timeStamp}) | ${currentUserName}: ${message}`});
  })

  socket.on('disconnect', ()=>{
    console.log(`User Disconnected: ${socket.id}`);

    const timeStamp = getCurrentTime();
    
    //get the users name
    const userName = connectedUsers.get(socket.id);

    //remove user from user list
    connectedUsers.delete(socket.id);

    //send new updated user list to front end
    //send chat message notifying user left chat
    socketListener.to(defaultRoom).emit('user_disconnected', Array.from(connectedUsers.values()).sort());
    socketListener.to(defaultRoom).emit('inbound_message',  {timeStamp, user_name: 'SERVER', message: `User ${userName} has left the chat`});

    
  })
});

server.listen(4000, () => {
  console.log("Server has been started");
});

const getCurrentTime = ()=>{
  const dateNow = new Date().toLocaleString();

  return dateNow;
}