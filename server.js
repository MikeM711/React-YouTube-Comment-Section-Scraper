const express = require('express');
const routes = require('./server/routes');
const bodyParser = require('body-parser');
const path = require('path');
const http = require("http");
const socketIo = require("socket.io");

const app = express();

// This React/Express application now works with Heroku
// No buildbpacks needed for this to work
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// body parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Server 
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log("user disconnected");
  });
});

app.set('socketio', io);

app.use('/', routes);

// Handles any requests that do not match the ones above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, (err) => {
  if (!err) {
    console.log('site is live');
  }
  else {
    console.log(err);
  };
});