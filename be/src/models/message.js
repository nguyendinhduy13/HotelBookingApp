const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: Array,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderType",
    },
    senderType: {
      type: String,
      required: true,
      enum: ["user", "hotel", "admin"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverType",
    },
    receiverType: {
      type: String,
      required: true,
      enum: ["user", "hotel", "admin"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("messages", messageSchema);
