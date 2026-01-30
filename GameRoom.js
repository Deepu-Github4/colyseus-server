const { Room } = require("colyseus");
const { State } = require("./state/State");
const { Player } = require("./state/Player");

class GameRoom extends Room {

  onCreate () {
    console.log("Room created");

    this.setState(new State());

    // 🔥 THIS IS CRITICAL (20 updates/sec)
    this.setSimulationInterval(() => this.update(), 50);
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
    // Server tick (required even if empty)
    // State patches flush from here
  }
}

module.exports = { GameRoom };
