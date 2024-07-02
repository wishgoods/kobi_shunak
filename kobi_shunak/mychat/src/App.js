import './App.css';
import Intro from './components/Intro/Intro';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes} from 'react-router-dom';
import Signup from './components/Signup/Signup';
import Rooms from './components/Rooms/Rooms';
import Room from './components/Room/Room';

function App() {



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