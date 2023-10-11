const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  id_hotel: { type: String, default: null },
  id_room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
  content: { type: String, default: null },
  rating: { type: Number, default: null },
  time_stamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("comment", commentSchema);
