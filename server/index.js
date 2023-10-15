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

var allUsers ={
    names: []
};

socketListener.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('logon', (data) => {
    console.log(data.name);
    allUsers.names.push(data.name);

    socket.broadcast.emit('user_connected', allUsers);
  });

  socket.on('disconnect', ()=>{
    console.log(`User Disconnected: ${socket.id}`);
    allUsers.names = allUsers.names.filter(name =>{
        //todo remove user from array when disconnected
    })
  })
});

server.listen(4000, () => {
  console.log("Server has been started");
});