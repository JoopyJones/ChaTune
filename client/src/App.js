import io from 'socket.io-client';

const socket = io.connect("http://localhost:3333");

//event handlers from server socket
socket.on('test-event',(data)=>{
  console.log(`data received from server ${data}`);
});

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>
    </div>
  );
}

export default App;
