const express = require('express');
const http = require('http');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server);

//event handlers from client socket
io.on('connection', (socket) =>{
    console.log(`Socket connection for: ${socket.id}`);
    io.emit('test-event', val= "gooba");


    socket.on('disconnect', ()=>{
        console.log(`Socket id: ${socket.id} has disconnected`);
    });
});

server.listen(3333, ()=>{
    console.log("Server Started");
});