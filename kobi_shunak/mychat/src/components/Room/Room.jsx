
import { useEffect, useState } from 'react';
import './Room.css';
import { Button, DialogTitle, List, ListItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import Chat from '../Chat/Chat';
import io from 'socket.io-client';
import Background from '../../assets/room2.webp'
const socket = io('http://localhost:5000');


const Room=(props)=>{
    const [users,setUsers] = useState(null);
    const [room,setRoom] = useState(null);
    const {room_number} = useParams();
    const [chat_user,setChatUser] = useState(null);
    
    useEffect(()=>{
        
        socket.on('sendMessage', async (message, route) => {
            if(route === "GetRoom")
            {     
                    setRoom(message);
                    
            }
            else if (route ==="RefreshUsers"){
                const not_me = message.filter((el)=>{ return( el.user!== localStorage.getItem("logged_user") )})
                setUsers(not_me);
            }
            else{

                const not_me = message.filter((el)=>{ return( el.user!== localStorage.getItem("logged_user") )})
                
                setUsers(not_me);
                
            }

        });
        
    },[])

    useEffect(()=>{

        socket.emit('sendMessage', {room_number:room_number} ,"GetRoom"); 
        socket.emit('sendMessage', {room_number:room_number} ,"GetRoomsUsers"); 

    },[room_number,users])

    useEffect(() => {
        const handleBackNavigation = (event) => {
            
            socket.emit('sendMessage', {user:localStorage.getItem('logged_user')} ,"LeaveRoom"); 
        };
        
        // Add event listener when component mounts
        window.addEventListener('popstate', handleBackNavigation);
        window.addEventListener('beforeunload',handleBackNavigation);

        // Clean up event listener when component unmounts
        return () => {
            window.removeEventListener('popstate',handleBackNavigation);
            window.removeEventListener('beforeunload',handleBackNavigation);
        };
      }, []);

    const selectUser=(user)=>{
        setChatUser(user);
        localStorage.setItem("chat_user",user)
    }
    const resetChatUser=()=>{
        setChatUser(null)
    }
    
    return (
        <div className='maincontainer' style={{backgroundImage:"url(" + Background + ")"}}>
            <div className='container' >
                <DialogTitle>{"Room " + room?.room_number+ " Users"}</DialogTitle>
                {users!=null?<List >
                    {users.map((el)=>{return <ListItem key={el.user}><Button onClick={()=>selectUser(el.user)}>{el.user}</Button></ListItem>})}
                </List>:<></>}
            </div>
            <Chat setChatUser={resetChatUser} chat_user={chat_user}></Chat>
        </div>);
}
//borderColor:room?.color,
export default Room;
