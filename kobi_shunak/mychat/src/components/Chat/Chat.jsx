import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Chat.css';
import { Card, FormLabel, Icon, Input, List, ListItem } from '@mui/material';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check'

const socket = io('http://localhost:5000');

const Chat = (props) => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
      };
    
      const clearInput = () => {
        setInputValue('');
      };
   
    useEffect(() => {
        socket.emit('sendMessage', {message:null,from:localStorage.getItem("logged_user"),to:localStorage.getItem("chat_user")} ,"AddMessage"); 

        socket.on('sendMessage', async (message, route) => {
            if(route === "FetchMessages")
            {     
                    setMessages(message);
                    socket.emit('sendMessage', {user:localStorage.getItem("logged_user")} ,"SeenMessages"); 
 
            }
            
        });
    }, [messages]);

    const sendMessage = (e) => {
      
        
        if(e.key=== "Enter"){
            socket.emit('sendMessage', {message:e.target.value,from:localStorage.getItem("logged_user"),to:localStorage.getItem("chat_user")} ,"AddMessage"); 
            clearInput();
        }
    };
    const closeChat=()=>{
        props.setChatUser();

    }

    const checkChatColors=(message)=>{
     
        
        if(message.from == localStorage.getItem("logged_user"))
            return "green";
        else 
            return "black"
        
    }
    return (
        <div className={'chatcontainer '+(props.chat_user!=null?"chat_open":"chat_closed")}><CloseIcon onClick={closeChat}></CloseIcon>
                <Card style={{overflowY:"scroll",height:"200px"}}><List>{messages?.map((el)=>{return <ListItem key={el.message+Date.now()+Math.random()} style={{color:checkChatColors(el)}}>{el.message}{el.seen?<><CheckIcon style={{width:"12px",color:"blue"}}></CheckIcon><CheckIcon style={{width:"12px",color:"blue"}}></CheckIcon></>:<></>}</ListItem>})}</List></Card>
            <Input 
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e)=>{sendMessage(e)}}
            ></Input>
        </div>
    );
};

export default Chat;