
import { useEffect, useState} from 'react';
import io from 'socket.io-client';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Button } from '@mui/material';
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
    const [room_deleted,setRoomDeleted] = useState(0);
    const navigate = useNavigate();
    
    
    useEffect(()=>{
        socket.emit('clearMessages');
        socket.emit('sendMessage', null ,"GetRooms");
    },[show_rooms,room_deleted]);
    useEffect(()=>{

       
        const handleBackNavigation = (event) => {
            
            socket.emit('sendMessage', {user:localStorage.getItem('logged_user')} ,"LeaveRoom"); 
            
        };
        const handleExitNavigation = (event) => {
            localStorage.removeItem("chat_user");
            localStorage.removeItem("logged_user");
            localStorage.removeItem("token");
            socket.emit('sendMessage', {user:localStorage.getItem('logged_user')} ,"LeaveRoom"); 
            
        };
        socket.on('sendMessage', async (message, route) => {
            setRooms(message);
        });
         // Add event listener when component mounts
         window.addEventListener('popstate', handleBackNavigation);
         window.addEventListener('beforeunload',handleExitNavigation);
 
         // Clean up event listener when component unmounts
         return () => {
             window.removeEventListener('popstate',null);
             window.removeEventListener('beforeunload',null);
         };
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
           if(new_room_data!= null) 
                socket.emit('sendMessage', {name:new_room_data.name,color:new_room_data.color} ,"AddRoom"); 
            setShowRooms(false);
            setNewRoomData(null)
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
        setRoomDeleted(room_number);
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