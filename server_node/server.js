const express = require("express");
const bodyParser = require("body-parser");

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');
const { manageRelays, emitUpdate } = require('./manageRelays');

const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {}

io.on('connection', socket => {
  const { id_user } = socket.handshake.query;

  connectedUsers[id_user] = socket.id;

  socket.on('newActivation', (relay) => {
    emitUpdate(io, relay);
  })
})

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

manageRelays(io);
io.on('newActivation', (newRelay) => {
  console.log("fora", newRelay)
  
})

app.use(routes);
app.use('/public', express.static('public'))
app.use('/img', express.static('src/img'))

server.listen(3000, () => {
  console.log("Started on PORT 3000");
})
