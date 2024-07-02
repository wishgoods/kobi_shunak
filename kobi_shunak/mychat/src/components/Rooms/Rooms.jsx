
import { useEffect, useState} from 'react';
import io from 'socket.io-client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Button, Input } from '@mui/material';
import './Rooms.css';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import AddRoom from '../AddRoom/AddRoom'
import RemoveIcon from '@material-ui/icons/Remove';

const socket = io('http://localhost:5000');

const Rooms=()=>{
    const [rooms, setRooms] = useState(null);
    const [show_rooms, setShowRooms] = useState(false);
    const [new_room_data,setNewRoomData]= useState(null);

    const navigate = useNavigate();
    
    useEffect(()=>{
        socket.emit('clearMessages');
        socket.emit('sendMessage', null ,"GetRooms");
    },[]);
    useEffect(()=>{
        socket.on('sendMessage', async (message, route) => {
            setRooms(message);
        });
        
    },[])
    const selectRoom=(room_number)=>{
        socket.emit('sendMessage', {user:localStorage.getItem('logged_user'),room:room_number} ,"AddUserToRoom"); 
        navigate(`/room/${room_number}`);

    }  
    const signOut=()=>{
      
        localStorage.removeItem("chat_user");
        localStorage.removeItem("token");
        localStorage.removeItem("logged_user")
        
        navigate('/');
    }
    const showAddRooms=()=>{
        if(show_rooms){
            socket.emit('sendMessage', {name:new_room_data.name,color:new_room_data.color} ,"AddRoom"); 
            setShowRooms(false);
        }
        else
            setShowRooms(true);
    }
    const closeAddRoom=()=>{
        setShowRooms(false);

    }
    const setRoomData=(data)=>{
        setNewRoomData(data);
    }
    const deleteRoom=(room_number)=>{
        socket.emit('sendMessage', {room_number:room_number} ,"DeleteRoom"); 
    }

    return (
        <div className='maincontainer'>
            <div className='container'>
                <h1>Rooms</h1>
                {rooms!=null?<List >
                    {rooms.map((el)=>{return <ListItem key={el.room_number}><RemoveIcon onClick={()=>deleteRoom(el.room_number)}></RemoveIcon><Button onClick={()=>selectRoom(el.room_number)}>{el.name}</Button></ListItem>})}
                </List>:<></>}
            </div>
            {show_rooms?<AddRoom closeAddRoom={closeAddRoom} setNewRoomData={(data)=>setRoomData(data)}></AddRoom>:<></>}
            <AddIcon onClick={showAddRooms}></AddIcon>
            <Button fullWidth={true} className='loginbutton' variant="outlined" onClick={signOut}>SignOut</Button>
            
        </div>);


}
export default Rooms;