const express = require('express');
const exphbrs = require('express-handlebars')
const routes = require('./server/routes')
const bodyParser = require('body-parser');
const path = require('path');

const http = require("http");
const socketIo = require("socket.io");

const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// body parser
app.use(bodyParser.urlencoded({
extended: false
}));
app.use(bodyParser.json());

// Server stuff
const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
 console.log('a user connected');
 // console.log(socket.id)
 // socket.emit('FromAPI', 'instant msg');
});

app.set('socketio', io);

app.use('/',routes)

// Testing our socketIO - Frontend will send a GET request to this route when mounted
// app.get('/timer', (req, res) => {
//  console.log('hit')
//  res.send('my timer')

//  const io = req.app.get('socketio');
//  io.emit('FromAPI', 'message from /timer');
// })

// Handlebars
app.set('views','./server/views')
app.engine('.hbs',exphbrs({
extname: '.hbs'
}))
app.set('view engine', '.hbs');

app.get('/api/hello', (req,res) => {
res.send({ express: 'Hello From Express' })
})

app.post('/ytdata', (req,res) => {
  console.log('Your URL is', req.body.url)
})

// POST method route example
// app.post('/api/world', (req, res) => {
//  console.log(req.body.post);
//  res.write('1. hello world ')
//  io.emit('FromAPI', 'starting /api/world');
//  setTimeout(() => {
//    res.write(
//      `2. I received your POST request. This is what you sent me: ${req.body.post}`,
//    );
//    io.emit('FromAPI', '3 seconds');
//  },3*1000)

//  setTimeout(() => {
//     io.emit('FromAPI', '10 seconds');
//    res.end();
//  },10*1000)
// });

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, (err) => {
if(!err){
  console.log('site is live')
}
else {
  console.log(err)
}
})
