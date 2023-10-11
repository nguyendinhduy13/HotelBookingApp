//create admin model for mongoose
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  idHotel: { type: String, default: null },
  dataHotel: { type: Array },
  name: { type: String, default: null },
  avatar: { type: String, default: null },
  phone_number: { type: String, default: null },
  email: { type: String, unique: true },
  country: { type: String, default: "Viet Nam" },
  roll: { type: String, default: "adminks" },
  password: { type: String },
  token: { type: String },
  tokenNotification: { type: String, default: null },
});

adminSchema.index({ roll: 1 }, { unique: false });
module.exports = mongoose.model("admin", adminSchema);
