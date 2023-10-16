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

//stores all connected users by (socket.id, {name, valid name})
var connectedUsers = new Map();

const defaultRoom = 333;

socketListener.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('logon', (data) => {
    console.log(`User Logged On: ${socket.id}`);

    //create a valid name for the user
    //  - if users with the same name are already connected, we will add the suffix (# of same name)
    //  ex) joop, joop(1), joop(2)...
    const validName = createValidName(data.name);

    //add new user to user list
    connectedUsers.set(socket.id,{name: data.name, validName});

    socket.join(defaultRoom);
    const timeStamp = getDateTimeStamp();

    const validNameArray = buildValidNameArray();

    //send new updated user list to front end
    socketListener.to(defaultRoom).emit('user_connected',  validNameArray);
    socketListener.to(defaultRoom).emit('inbound_message',  {timeStamp, userName: 'SERVER', message: `User ${validName} has joined the chat`});


  })

  socket.on('outbound_message', (message) =>{
    console.log(`Message Sent By: ${socket.id}`);

    //get the current users name
    const userName = connectedUsers.get(socket.id).validName;

    const timeStamp = getDateTimeStamp();

    //send message to all sockets {time, name, message}
    socketListener.to(defaultRoom).emit('inbound_message',  {timeStamp, userName, message: `(${timeStamp}) | ${userName}: ${message}`});
  })

  socket.on('disconnect', ()=>{
    console.log(`User Disconnected: ${socket.id}`);
    
    //get the users name
    const userName = connectedUsers.get(socket.id).validName;

    //remove user from user list
    connectedUsers.delete(socket.id);

    const timeStamp = getDateTimeStamp();

    const validNameArray = buildValidNameArray();

    //send new updated user list to front end
    //send chat message notifying user left chat
    socketListener.to(defaultRoom).emit('user_disconnected', validNameArray);
    socketListener.to(defaultRoom).emit('inbound_message',  {timeStamp, userName: 'SERVER', message: `User ${userName} has left the chat`});

    
  })
});

server.listen(4000, () => {
  console.log("Server has been started");
});

//helper functions
const getDateTimeStamp = ()=>{
  const dateNow = new Date().toLocaleString();

  return dateNow;
}

//counts how many connected user names match the argument and returns a unique user name
//if name is already used, will return argument with count as suffix to end of name: (1), (2), (3)...
//if no matches, just returns the argument as the name
const createValidName = (userName) => {
  const numSameNames = Array.from(connectedUsers.values()).reduce((prev, current) =>{
    return current.name === userName ? prev+1 : prev;
  },0);

  return numSameNames > 0 ? userName+`(${numSameNames})` : userName;

};

//generates an array of all valid user names
const buildValidNameArray = () =>{
  var retValidNameArray =[];

  Array.from(connectedUsers.values()).forEach((name)=>{
    retValidNameArray.push(name.validName);
  })

  return retValidNameArray.sort();


}