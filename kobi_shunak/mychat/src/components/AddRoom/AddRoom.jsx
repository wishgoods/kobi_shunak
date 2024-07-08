import { Input } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@material-ui/icons/Close';

const AddRoom=(props)=>{
    const [room_name,setRoomName] = useState("room name");
    const [room_color,setRoomColor] = useState("room color");
    const clearInput=(name)=>{
        if(name==="color")
        {
            setRoomColor('')
        }
        else{
            setRoomName('')
        }
    }
    const closeAddRoom=()=>{
        props.closeAddRoom();
    }


    return(<>
    <CloseIcon onClick={closeAddRoom}></CloseIcon>
    <Input value={room_name} onClick={()=>clearInput("name")} onChange={(e)=>{setRoomName(e.target.value); props.setNewRoomData({name:room_name,color:room_color});}}>
    </Input><Input value={room_color} onClick={()=>clearInput("color")}  onChange={(e)=>{setRoomColor(e.target.value); props.setNewRoomData({name:room_name,color:room_color});}}></Input></>);
}

export default AddRoom;