const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/"));

let players = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);
  players[socket.id] = { x: 0, y: 1.6, z: 0 };

  io.emit("updatePlayers", players);

  socket.on("move", (data) => {
    players[socket.id] = data;
    io.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

server.listen(3000, () => console.log("🚀 Tiffyverse server running on :3000"));
