const app = require('express');
const http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

// store room data
const rooms = {};

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  // join room
  socket.on('joinRoom', ({ roomName, userName }) => {
    console.log(`User ${socket.id} joined room ${roomName}`);
    socket.join(roomName);
    const room = rooms[roomName];
    if (!room) {
      rooms[roomName] = { users: [{ id: socket.id, name: userName }] };
    } else {
      room.users.push({ id: socket.id, name: userName });
    }
    io.to(roomName).emit('updateUserList', room.users);
    socket.emit('systemMessage', `Welcome to ${roomName}, ${userName}!`);
    socket.broadcast.to(roomName).emit('systemMessage', `${userName} has joined the room`);
  });

  // leave room
  socket.on('leaveRoom', ({ roomName, userName }) => {
    console.log(`User ${socket.id} left room ${roomName}`);
    socket.leave(roomName);
    const room = rooms[roomName];
    if (room) {
      room.users = room.users.filter(user => user.id !== socket.id);
      io.to(roomName).emit('updateUserList', room.users);
      io.to(roomName).emit('systemMessage', `${userName} has left the room`);
      if (room.users.length === 0) {
        delete rooms[roomName];
      }
    }
  });

  // send message
  socket.on('sendMessage', ({ roomName, userName, message }) => {
    console.log(`User ${socket.id} sent message in ${roomName}: ${message}`);
    io.to(roomName).emit('newMessage', { userName, message });
  });

  // create room
  socket.on('createRoom', ({ roomName }) => {
    console.log(`User ${socket.id} created room ${roomName}`);
    if (!rooms[roomName]) {
      rooms[roomName] = { users: [] };
      socket.emit('roomCreated', roomName);
    } else {
      socket.emit('roomExists', roomName);
    }
  });

  // get room list
  socket.on('getRoomList', () => {
    console.log(`User ${socket.id} requested room list`);
    const roomList = Object.keys(rooms);
    socket.emit('roomList', roomList);
  });

  // disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    for (const roomName in rooms) {
      const room = rooms[roomName];
      room.users = room.users.filter(user => user.id !== socket.id);
      if (room.users.length === 0) {
        delete rooms[roomName];
      } else {
        io.to(roomName).emit('updateUserList', room.users);
        io.to(roomName).emit('systemMessage', `User ${socket.id} has left the room`);
      }
    }
  });
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});