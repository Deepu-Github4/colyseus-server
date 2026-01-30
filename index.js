const { Server, Room } = require("colyseus");
const { createServer } = require("http");
const { WebSocketTransport } = require("@colyseus/ws-transport");

const { State } = require("./schema/State");
const { Player } = require("./schema/Player");

class GameRoom extends Room {

  onCreate () {
    console.log("Room created");

    this.setState(new State());

    // 🔥 REQUIRED: server tick (20 times/sec)
    this.setSimulationInterval(() => this.update(), 50);

    // -------- MOVEMENT MESSAGE --------
    this.onMessage("move", (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.x = data.x;
      player.y = data.y;
      player.z = data.z;
      player.rotY = data.rotY;
      player.speed = data.speed;
    });

    // -------- SIT MESSAGE --------
    this.onMessage("sit", (client, isSitting) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.isSitting = isSitting;
    });

    // -------- SKIN MESSAGE --------
    this.onMessage("skin", (client, skinIndex) => {
      const player = this.state.players.get(client.sessionId);
      if (!player) return;

      player.skinIndex = skinIndex;
    });
  }

  onJoin (client) {
    console.log("JOIN:", client.sessionId);

    const player = new Player();
    this.state.players.set(client.sessionId, player);
  }

  onLeave (client) {
    console.log("LEAVE:", client.sessionId);
    this.state.players.delete(client.sessionId);
  }

  update () {
    // Server tick keeps schema patches flowing
  }
}

const server = new Server({
  transport: new WebSocketTransport({
    server: createServer()
  })
});

server.define("game", GameRoom);
server.listen(2567);

console.log("✅ Colyseus running at ws://localhost:2567");
