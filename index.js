const { Server, Room } = require("colyseus");
const { createServer } = require("http");
const { WebSocketTransport } = require("@colyseus/ws-transport");

const { State } = require("./schema/State");
const { Player } = require("./schema/Player");

// ---------------- ROOM ----------------
class GameRoom extends Room {
  onCreate () {
    console.log("Room created");
    this.setState(new State());
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

  update () {}
}

// ---------------- SERVER ----------------
const port = process.env.PORT || 2567;
const httpServer = createServer();

const gameServer = new Server({
  transport: new WebSocketTransport({
    server: httpServer
  })
});

gameServer.define("game", GameRoom);

httpServer.listen(port, () => {
  console.log(`✅ Colyseus running on port ${port}`);
});
