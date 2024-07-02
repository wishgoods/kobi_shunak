const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const {
  connectToDatabase,
  disconnectFromDatabase
} = require('../server/data/db'); // Assuming db.js is in the same directory
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


let mongoClient, database, collection, collection_rooms, collection_messages; //collections
const secretKey = "myvalidkey" // for token 


const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["my-custom-header"],
  }
});


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


io.on('connection', (socket) => { //connect to mongodb
  connectToDatabase()
    .then(client => {
      mongoClient = client;
      database = client.db('chatApp'); // Set database reference
      collection = database.collection('users'); // Set collection reference
      collection_rooms = database.collection('rooms');
      collection_usersrooms = database.collection('usersrooms');
      collection_messages = database.collection('messages');

    });
  // Handle clear messages event
  socket.on('clearMessages', () => {

    console.log('Clear messages event received');
    // Broadcast clear messages event to all connected clients
    io.emit('clearMessages');
  });
  // Listen for incoming messages routes names are explainatory
  socket.on('sendMessage', async (message, route) => {

    if (route === "AddUser") {

      try {
        const user = await collection.findOne({
          username: message.username
        });
        if (user == null) {

          await collection.insertOne(message);
          socket.emit('sendMessage', "user added");

        } else {

          socket.emit('sendMessage', "user exists");
        }
      } catch (error) {
        console.error('Error adding user:', error);

      }

    } else if (route === "GetUser") {

      const username = message.username;
      const password = message.password;
      try {
        const user = await collection.findOne({
          username: username,
          password: password
        });
        if (user == null) {
          socket.emit('sendMessage', "user does not Exists");
        } else {
          const token = jwt.sign({
            id: user.id,
            username: user.username
          }, secretKey, {
            expiresIn: '1h'
          });

          socket.emit('sendMessage', token);
        }
      } catch (error) {
        console.error('Error adding user:', error);

      }

    } else if (route === "GetUsers") {
      //console.log('Message received: ', message);

    } else if (route === "DeleteUser") {
      //console.log('Message received: ', message);

    } else if (route === "GetRooms") {

      try {
        const rooms = await collection_rooms.find().toArray();
        socket.emit('sendMessage', rooms);


      } catch (error) {
        console.error(error);

      }
    } else if (route === "AddUserToRoom") {
      let users = [];

      const exists = await collection_usersrooms.find({
        username: {
          $exists: true
        }
      }).toArray();

      exists.forEach((el) => {
        if (message.user == el.username) {
          users.push(el);
        }
      })



      if (users.length < 1) {
        await collection_usersrooms.insertOne({
          user: message.user,
          room: message.room
        });
      }

    } else if (route === "GetRoom") {
      try {
        let room = null;

        const exists = await collection_rooms.find({
          room_number: {
            $exists: true
          }
        }).toArray();

        exists.forEach((el) => {
          if (message.room_number == el.room_number) {
            room = el;
          }
        })

        socket.emit('sendMessage', room, "GetRoom");


      } catch (error) {
        console.error(error);

      }
    } else if (route === "GetRoomsUsers") {
      let users = [];

      const exists = await collection_usersrooms.find({
        room: {
          $exists: true
        }
      }).toArray();

      exists.forEach((el) => {
        if (message.room_number == el.room) {
          users.push(el);
        }
      })

      socket.emit('sendMessage', users, "GetRoomsUsers");
    } else if (route === "LeaveRoom") {

      await collection_usersrooms.deleteMany({
        user: message.user
      });

    } else if (route === "AddMessage") {
      if (message.message != null && message.from != "" && message.to != "") {

        await collection_messages.insertOne({
          from: message.from,
          message: message.message,
          to: message.to,
          seen:false
        });
      }
      let messages = [];

      const exists = await collection_messages.find({
        from: {
          $exists: true
        }
      }).toArray();

      exists.forEach((el) => {
        if (message.from == el.from && message.to == el.to || message.to == el.from && message.from == el.to) {
          messages.push(el);
        }
      })


      socket.emit('sendMessage', messages, "FetchMessages");


    } else if (route === "AddRoom") {

      if(message?.name!='' && message?.color!='')
      {
        
        const exists = await collection_rooms.find({
          room_number: {
            $exists: true
          }
        }).toArray();
  
        
        await collection_rooms.insertOne({
          room_number: exists.length+1,
          color: message.color,
          name: message.name
        });

      }

    }
    else if (route === "DeleteRoom") {

      if(message?.name!='' && message?.color!='')
      {
        
        await collection_rooms.deleteMany({
          room_number: message.room_number
        });

      }

    }
    else if (route === "SeenMessages") {
      collection_messages.updateMany(
      { to: message.user }, 
      { $set: { "seen": true } } // Update operation to set the new value
   )
    }
  });
  
  socket.on('disconnect', () => {
   
  });
});



io.send("hello");

app.use((req, res, next) => {

});


server.listen(5000, () => {
  console.log('listening on *:5000');
});