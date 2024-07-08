import './App.css';
import Intro from './components/Intro/Intro';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Rooms from './components/Rooms/Rooms';
import Room from './components/Room/Room';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    socket.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect');
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      if(isConnected){
        socket.off('connect');
        socket.off('message');
        socket.disconnect();
      }
      
    };
  }, [isConnected]);

  return ( 
    <BrowserRouter>
      
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:room_number" element={<Room />} />

      </Routes>
      
    </BrowserRouter>
  );
}

export default App;