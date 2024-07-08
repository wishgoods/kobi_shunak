import React, { useState, useEffect } from 'react';
import './Signup.css';
import Input from '@mui/material/Input';
import  Button  from '@mui/material/Button';
import { FormLabel, InputLabel } from '@mui/material';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const Signup = () => {
    
    const [user_data,setUserData]=useState({username:'',password:'',name:''});
    const [err,setErr]=useState(false);
    const [info,setInfo]=useState(false);
    const [msg,setMsg]= useState(false);
    const [info_msg,setInfoMsg] = useState(null);

    const navigate = useNavigate();

    useEffect(()=>{
        socket.on('sendMessage', async (message, route) => {
            if(message === "user exists"){
                setInfo(true);
                setTimeout(()=>{setInfo(false);},3000);
            }
            if(message === "user added"){
                setInfoMsg("User Added !")
                setMsg(true);
                setTimeout(()=>{
                        setMsg(false);
                        navigate('/');
                    },3000);
                


            }
        });

    },[navigate])
    const sigup=()=>{
        
        if(user_data.name.length>3 && user_data.username.length>3 &&user_data.password.length>=6) // could add more verfications here
         {   
            socket.emit('sendMessage', user_data ,"AddUser");
            
         }
         else{
            setErr(true);
            setTimeout(()=>{setErr(false);},3000);
         }
        
    }
    const setData=(e,type)=>{
        if(type==="password"){setUserData({...user_data,password:e.target.value});}
        else if(type==="username"){setUserData({...user_data,username:e.target.value});}
        else{setUserData({...user_data,name:e.target.value});}
    }
    
    return (
        <div className='maincontainer'>
            <div className='container'>
                <h1 className='title'>Signup</h1>
                <InputLabel>username</InputLabel>
                <Input value={user_data.username}  onChange={(e)=>setData(e,"username")}/>
                <InputLabel>password</InputLabel>
                <Input value={user_data.password} type='password' onChange={(e)=>setData(e,"password")}/>
                <InputLabel>name</InputLabel>
                <Input value={user_data.name}  onChange={(e)=>setData(e,"name")}/>
                <div className='spacer'></div>
                <Button fullWidth={true} className='loginbutton' variant="outlined" onClick={sigup}>Signup</Button>
                {err?<FormLabel style={{color:"red"}} color='error'>{"must fill all fields properly"}</FormLabel>:<></>}
                {info?<FormLabel style={{color:"red"}} color='error'>{"user Exists"}</FormLabel>:<></>} 
                {msg?<FormLabel style={{color:"green"}} color='success'>{info_msg}</FormLabel>:<></>} 

            </div>
        </div>
    );
};

export default Signup;