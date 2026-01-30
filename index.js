// ================== IMPORTS ==================
const express = require("express");
const cors = require("cors");
const http = require("http");

const { Server, Room } = require("colyseus");
const { WebSocketTransport } = require("@colyseus/ws-transport");

const { State } = require("./schema/State");
const { Player } = require("./schema/Player");

// ================== ROOM ==================
class GameRoom extends Room {

  onCreate () {
    console.log("Room created");

    this.setState(new State());

    // Server tick (20 FPS)
    this.setSimulationInterval(() => this.update(), 50);

    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.x = data.x;
      player.y = data.y;
      player.z = data.z;
      player.rotY = data.rotY;
      player.speed = data.speed;
    });

    this.onMessage("sit", (client, isSitting) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.isSitting = isSitting;
    });

    this.onMessage("skin", (client, skinIndex) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;
      player.skinIndex = skinIndex;
    });
  }

  onJoin (client) {
    console.log("JOIN:", client.sessionId);
    this.state.players.set(client.sessionId, new Player());
  }

  onLeave (client) {
    console.log("LEAVE:", client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  update () {
    // keep schema patches flowing
  }
}

// ================== SERVER ==================
const PORT = process.env.PORT || 2567;

// Express app (for CORS + matchmaking HTTP)
const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));

// Optional health check (Render likes this)
app.get("/", (req, res) => {
  res.send("Colyseus server is running");
});

// HTTP server
const httpServer = http.createServer(app);

// Colyseus server
const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer
  })
});

// Register room
gameServer.define("game", GameRoom);

// Start server
httpServer.listen(PORT, () => {
  console.log(`✅ Colyseus running on port ${PORT}`);
});
