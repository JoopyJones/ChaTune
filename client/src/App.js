//styling
import './App.css';

//router
import {Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from 'react-router-dom';

//layout
import RootLayout from './components/layouts/RootLayout';

//components
import Login from './components/pages/Login';
import Main from './components/pages/Main';

//socket
import io from 'socket.io-client';

function App() {
  const socket = io.connect('http://localhost:4000');

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<RootLayout/>}>
        <Route index element={<Login socket={socket} />}/>
        <Route path='chat' element={<Main socket={socket} />}/>
      </Route>
    )
  )

  return (
    <div className="App">
      <header className="App-header"> 
        <RouterProvider router={router}/>
      </header>
    </div>
  );
}

export default App;
