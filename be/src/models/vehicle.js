const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  name: { type: String, default: null },
  brand: { type: String, default: null },
  specification: { type: Array, default: [] },
  price: { type: Number, default: null },
  image:{type: Array,default:[]},
  hotel_id: { type: String, default: null },
  description: { type: String, default: null },
});

module.exports = mongoose.model("vehicle", vehicleSchema);
