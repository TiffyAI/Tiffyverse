const socket = io();

// Player state
let playerId = null;
let players = {};

// On connect
socket.on("connect", () => {
  playerId = socket.id;
  console.log("Connected as:", playerId);
});

// Sync players
socket.on("updatePlayers", (data) => {
  players = data;
});

// Example movement loop
setInterval(() => {
  const player = document.querySelector("#player");
  if (!player) return;

  const pos = player.object3D.position;
  socket.emit("move", { x: pos.x, y: pos.y, z: pos.z });
}, 100);
