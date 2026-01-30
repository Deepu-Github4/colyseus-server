const { Schema, MapSchema, type } = require("@colyseus/schema");
const { Player } = require("./Player");

class State extends Schema {
  constructor () {
    super();
    this.players = new MapSchema();
  }
}

type({ map: Player })(State.prototype, "players");

module.exports = { State };
