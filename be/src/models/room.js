const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, default: null },
  price: { type: Number, default: null },
  description: { type: String, default: null },
  image: { type: Array, default: null },
  isactive: { type: Boolean, default: true },
  utility: { type: Array, default: null },
  hotel_id: { type: String, default: null },
  tag: { type: Array, default: null },
});

module.exports = mongoose.model("room", roomSchema);
