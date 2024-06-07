const io = require('socket.io')(3001, {
  cors: {
    origin: '*',
  },
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('create_room', () => {
    const roomId = `room-${socket.id}`;
    rooms[roomId] = { players: [socket.id], raceResults: [] };
    socket.join(roomId);
    console.log(`Room created: ${roomId}`);
    socket.emit('room_created', roomId);
    console.log(`Player ${socket.id} joined room: ${roomId} players : ${rooms[roomId].players}`);
  });

  socket.on('join_room', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].players.push(socket.id);
      socket.join(roomId);
      console.log(`Player ${socket.id} joined room: ${roomId} ${rooms[roomId].players}`);
      io.to(roomId).emit('room_joined', roomId, rooms[roomId].players);
      io.to(roomId).emit('player_joined', socket.id);
    } else {
      socket.emit('error', 'Room not found');
    }
  });

  socket.on('start_game', (roomId) => {
    console.log(`Game started in room: ${roomId}`);
    io.to(roomId).emit('game_started');
  });

  socket.on('answer_submitted', ({ roomId, correctAnswers}) => {
    console.log(`Player ${socket.id} in room ${roomId} submitted an answer: ${correctAnswers}`);
    io.to(roomId).emit('update_progress', { socketId: socket.id, correctAnswers });
  });

  socket.on('finish_race', (roomId) => {
    if (rooms[roomId]) {
      rooms[roomId].raceResults.push(socket.id);
      console.log(`Player ${socket.id} finished race in room ${roomId}`);
      io.to(roomId).emit('update_leaderboard', rooms[roomId].raceResults);
    }
  });
  socket.on('restart_game', (roomId) => {
    io.to(roomId).emit('restart_game');
  });
  socket.on('disconnect', () => {
    console.log(`Player ${socket.id} disconnected`);
    for (const roomId in rooms) {
      const room = rooms[roomId];
      room.players = room.players.filter((id) => id !== socket.id);
      if (room.players.length === 0) {
        delete rooms[roomId];
        console.log(`Room ${roomId} deleted`);
      } else {
        io.to(roomId).emit('player_left', socket.id);
      }
    }
  });
});
