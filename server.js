const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

let players = {};

io.on("connection", (socket) => {
  console.log("New player:", socket.id);
  players[socket.id] = { x: 0, y: 1.6, z: 0 };

  io.emit("player-joined", socket.id);

  socket.on("move", (data) => {
    players[socket.id] = data;
    io.emit("state-update", players);
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
    io.emit("player-left", socket.id);
  });
});

server.listen(3000, () => {
  console.log("🚀 Multiplayer server running on http://localhost:3000");
});
