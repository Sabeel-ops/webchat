const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname)); // Serve static files from the current directory

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (data) => {
    const messageContent = data.message;

    if (messageContent.startsWith('/random')) {
      const randomNumber = Math.floor(Math.random() * 100) + 1;
      socket.emit('chat message', { user: 'Server', message: `You rolled a random number: ${randomNumber}` });
    } else if (messageContent.startsWith('/calc')) {
      const calcExpression = messageContent.substring('/calc'.length).trim();
      try {
        const result = eval(calcExpression);
        socket.emit('chat message', { user: 'Server', message: `Result: ${result}` });
      } catch (error) {
        socket.emit('chat message', { user: 'Server', message: 'Invalid calculation' });
      }
    } 
    
    else {
      let modifiedMessage = messageContent
        .replace(/\bhey\b/gi, "👋")
        .replace(/\bwhoa\b/gi, "🤯")
        .replace(/\blike\b/gi, "❤️")
        .replace(/\blol\b/gi, "😄")
        .replace(/\breact\b/gi, "⚛️")
        .replace(/\bcongratulations\b/gi, "🎉");

      io.emit('chat message', { user: socket.userName, message: modifiedMessage });
    }
  });

  socket.on('set username', (userName) => {
    socket.userName = userName;
    io.emit('user joined', userName); // Notify other clients about the user joining
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    if (socket.userName) {
      io.emit('user left', socket.userName); // Notify other clients about the user leaving
    }
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
