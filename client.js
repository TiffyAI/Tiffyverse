const socket = io();
let playerId = null;
let players = {};

// Player avatar color palette
const colors = ["#ff0000","#00ff00","#0000ff","#ffff00","#ff00ff","#00ffff"];

socket.on("connect", () => {
  playerId = socket.id;
  console.log("Connected as:", playerId);
});

// Update all players
socket.on("updatePlayers", (data) => {
  players = data;
  renderPlayers();
});

// Render avatars
function renderPlayers() {
  const scene = document.querySelector('a-scene');
  Object.keys(players).forEach(id => {
    if (!scene.querySelector(`#player-${id}`)) {
      const entity = document.createElement('a-sphere');
      entity.setAttribute('id', `player-${id}`);
      entity.setAttribute('radius', '0.5');
      entity.setAttribute('color', colors[Math.floor(Math.random()*colors.length)]);
      entity.setAttribute('position', `${players[id].x} ${players[id].y} ${players[id].z}`);
      scene.appendChild(entity);
    } else {
      const entity = scene.querySelector(`#player-${id}`);
      entity.setAttribute('position', `${players[id].x} ${players[id].y} ${players[id].z}`);
    }
  });
}

// Send movement updates
setInterval(() => {
  const player = document.querySelector("#player");
  if (!player) return;
  const pos = player.object3D.position;
  socket.emit("move", { x: pos.x, y: pos.y, z: pos.z });
}, 100);
