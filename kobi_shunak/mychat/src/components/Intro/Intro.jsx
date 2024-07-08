import React, { useState, useEffect } from 'react';
import './Intro.css';
import Input from '@mui/material/Input';
import  Button  from '@mui/material/Button';
import { FormLabel, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Intro = () => {
    
    const [user_data,setUserData]=useState({username:'',password:''});  
    const [info,setInfo]=useState(false);

    const navigate = useNavigate();

    useEffect(()=>{
        socket.on('sendMessage', async (message, route) => {
            if(message === "user does not Exists"){
                setInfo(true);
                setTimeout(()=>{setInfo(false);},3000);
            }
            else{
                
                localStorage.setItem("token",message);
                navigate('/rooms');
            }
        });

    },[navigate])

    const login=()=>{
        socket.emit('sendMessage', user_data ,"GetUser");
        localStorage.setItem("logged_user",user_data.username);


    }
    const gotosignup=()=>{
        navigate('/signup');

    }
    const setData=(e,type)=>{
        if(type==="password"){setUserData({...user_data,password:e.target.value});}
        else if(type==="username"){setUserData({...user_data,username:e.target.value});}
        else{setUserData({...user_data,name:e.target.value});}
    }

    return (
        
            <div className='maincontainer'>
                <div className='container'>
                    <h1 className='title'>Login</h1>
                    <InputLabel>username</InputLabel>
                    <Input value={user_data.username} onChange={(e)=>setData(e,"username")}/>
                    <InputLabel>password</InputLabel>
                    <Input value={user_data.password} type='password' onChange={(e)=>setData(e,"password")}/>
                    
                    <div className='spacer'></div>
                    <Button fullWidth={true} className='loginbutton' variant="contained" onClick={login}>Login</Button>
                    <div className='spacer'></div>
                    <Button fullWidth={true} className='loginbutton' variant="outlined" onClick={gotosignup}>Signup</Button>

                    {info?<FormLabel style={{color:"red"}} color='error'>{"user and password dont match"}</FormLabel>:<></>} 

                </div>
            </div>
       
    );
};

export default Intro;