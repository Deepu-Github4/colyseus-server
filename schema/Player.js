const { Schema, type } = require("@colyseus/schema");

class Player extends Schema {
  constructor () {
    super();
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotY = 0;
    this.speed = 0;
    this.isSitting = false;
    this.skinIndex = 0; // ✅ NEW
  }
}

type("number")(Player.prototype, "x");
type("number")(Player.prototype, "y");
type("number")(Player.prototype, "z");
type("number")(Player.prototype, "rotY");
type("number")(Player.prototype, "speed");
type("boolean")(Player.prototype, "isSitting");
type("number")(Player.prototype, "skinIndex"); // ✅ NEW

module.exports = { Player };
