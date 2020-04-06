const express = require('express')
const socket = require('socket.io');
const port = process.env.PORT || 5000;
const cors = require('cors')
const app = express();
const { createChat } = require("./utils/factories")
//const Message = require('./models/message');
app.use(cors())


require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app)


const server = app.listen(port, () => {
  console.log("Howdy, I am running at PORT " + port)
})

// app.listen(port, () => {
//   console.log("Howdy, I am running at PORT " + port)
// })

let connectedUsers = {};



//send private message
// app.post('/privateChat', async (req, res) => {
//   let io = socket(server);
//   io.on('connection', (socket) => {

//     console.log('A user connected', socket.id);

//     socket.on('disconnect', () => {
//       console.log("A user disconnected");
//     });

//     socket.on('chatMessage', async (data) => {
//       let message = data.message
//       let created = new Date
//       let username = data.user

//       let response = await new Message({
//         message,
//         created,
//         username
//       })

//       await response.save()
//       socket.broadcast.emit('chatMessage', (data));

//     });

//     socket.on('typing', (data) => {
//       socket.broadcast.emit('typing', (data));
//     });

//     socket.on('joined', (data) => {
//       socket.broadcast.emit('joined', (data));
//       socket.emit('connections', {
//         id: socket.id,
//         number: Object.keys(io.sockets.connected).length
//       });
//     });

//     socket.on('leave', (data) => {
//       socket.broadcast.emit('leave', (data));
//       console.log(data);

//     });

//   });
// })


//working unordered group chat
// let io =  socket(server);
// io.on('connection', (socket) => {

// console.log('A user connected', socket.id);

// //  socket.emit('connections', Object.keys(io.sockets.connected).length);

//  socket.on('disconnect', () => {
//      console.log("A user disconnected");
//  });

//  socket.on('chatMessage',  (data) => {
//  socket.to(data.group).emit('chatMessage', (data));
// // socket.to(data.userid).emit('chatMessage', (data));
// });

//  socket.on('typing', (data) => {
//      socket.to(data.group).emit('typing', (data));
//  });

//  socket.on('joined', (data) => {
//       socket.join(data.group)
//       socket.emit('connections', {
//         id : socket.id,
//         number : Object.keys(io.sockets.connected).length,
//         group : data.group
//       })

//       socket.to(data.group).emit('joined', data)  
//     console.log(socket.rooms);
//  });

//  socket.on('leave', (data) => {
//      socket.broadcast.emit('leave', (data));
//      console.log(data);

//  }); 
// //  io.emitter.setMaxListeners(15)
// });


//test unordered private chat
let io = socket(server);
io.on('connection', (socket) => {

  console.log('A user connected', socket.id);

  //socket.emit('connections', Object.keys(io.sockets.connected).length);

  //User Connects
  socket.on("userConnected", (data) => {
    data.socketId = socket.id;
    connectedUsers[data.id] = data;
    socket.user = data
    console.log(connectedUsers);

  })

  //User disconnects
  socket.on('disconnect', () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.id)

      io.emit("userDisconnected", connectedUsers)
      console.log("Disconnect", connectedUsers);
    }
  })

  //User logsout
  socket.on("logout", () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name)
    io.emit("userDisconnected", connectedUsers)
    console.log("Disconnect", connectedUsers);
  })

  //events for group message

  //whn user joins a group
  socket.on('joined', (data) => {
    socket.join(data)
    //socket.to(data.group).emit('joined', data)
    console.log(data)
    console.log("connectedUsers");

  });

  //when user sends a group message
  socket.on("chatMessage", (data) => {
    if (data.id in connectedUsers) {
      socket.to(data.group).emit("chatMessage", data);
      console.log(true);
      console.log(data);
      
      return;
    }
    console.log(false);

  })

  //when user is typing in a groupchat
  socket.on('typing', ({ sender, receiver }) => {
    if (receiver in connectedUsers) {
      const receiverSocket = connectedUsers[receiver].socketId
      socket.to(receiverSocket).emit("typing", sender);
      console.log(true);
      return;
    }
    console.log(false);
  })


  //events for private message

  //Private message
  socket.on("privateMessage", ({ receiver, sender }) => {
    if (receiver in connectedUsers) {
      const newChat = createChat(`${receiver}&${sender}`, [receiver, sender])
      const receiverSocket = connectedUsers[receiver].socketId
      socket.to(receiverSocket).emit("privateMessage", newChat)
      socket.emit("privateMessage", newChat);
      console.log(true);
      console.log(newChat);

      return;
    }
    console.log(false);
  })

  //when user is typing  in a PM
  socket.on('privateTyping', ({ sender, receiver }) => {
    if (receiver in connectedUsers) {
      const receiverSocket = connectedUsers[receiver].socketId
      socket.to(receiverSocket).emit("privateTyping", sender);
      console.log(true);
      return;
    }
    console.log(false);
  })
});


//remove users who disconnects
function removeUser(userList, username) {
  let newList = userList
  delete newList[username]
  return newList
}


