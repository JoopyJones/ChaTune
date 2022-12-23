var chatWindow = document.getElementById('chatWindow');
var message = document.getElementById('message');
var submitButton = document.getElementById('submitButton');

var socket = io.connect('http://localhost:3000');

submitButton.addEventListener('click', function(event){
    socket.emit('message', ()=> 'gooba')
    console.log("after the emit");
});

socket.on('message',(data)=>{
    console.log(data);
})

console.log(submitButton);
