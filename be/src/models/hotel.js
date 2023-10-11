const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  id: { type: String, default: null, unique: true },
  name: { type: String, default: null },
  advantage: { type: String, default: null },
  comments: [
    { type: mongoose.Schema.Types.ObjectId, ref: "comment", default: [] },
  ],
  vehicles:[{ type: mongoose.Schema.Types.ObjectId, ref: "vehicle", default: [] }],
  description: { type: String, default: null },
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "room", default: [] }],
  image: { type: Array, default: [] },
  isactive: { type: Boolean, default: false },
  address: { type: String, default: null },
  position: { type: Array, default: [] },
  tag: { type: String, default: null },
});

module.exports = mongoose.model("hotel", hotelSchema);
