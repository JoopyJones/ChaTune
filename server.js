const express = require('express');
const io = require('socket.io');

const app = express();
const server = app.listen(3000,()=>{
    console.log('Server has been started');
});

app.use(express.static('public'));

var serverSocket = io(server);

serverSocket.on('connection', (socket)=>{
    console.log(`Connection has been made ${socket.id}`);

    serverSocket.on('message', (data)=>{
        console.log(`Message received from ${socket.id}`);
        serverSocket.emit('message', data);
    });

    serverSocket.on('disconnect', ()=>{
        console.log(`${socket.id} has disconnected`);
    })
})