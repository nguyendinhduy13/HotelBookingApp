const express = require("express");

const {
  getMessages,
  addMessage,
  deleteMessage,
  getAllMessages,
  deleteAllMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/getmsg/", getMessages);
router.post("/sendmsg/", addMessage);
router.post("/getallmsg", getAllMessages);
router.post("/deletemsg/:id", deleteMessage);
router.post("/deleteallmsg", deleteAllMessages);

module.exports = router;
