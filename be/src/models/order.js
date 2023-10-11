const mongoose = require("mongoose");

// add order schema

const orderSchema = new mongoose.Schema({
  id_user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  id_room: { type: mongoose.Schema.Types.ObjectId, ref: "room" },
  id_vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle" },
  id_hotel: { type: String, default: "" },
  check_in: { type: String, default: "" },
  check_out: { type: String, default: "" },
  start_date: { type: String, default: "" },
  end_date: { type: String, default: "" },
  total: { type: Number, default: 0 },
  status: { type: String, default: "Pending" },
  payment_method: { type: String, default: "payment-hotel" }, //payment-hotel,payment-momo,payment-zalopay
  paymented: { type: Boolean, default: false },
  reviewed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", orderSchema);
