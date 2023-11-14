const express = require("express");

const {
  AddNewRoom,
  GetAllRooms,
  GetRoomById,
  UpdateRoom,
  DeleteRoom,
} = require("../controllers/roomController");

const router = express.Router();

router.post("/addnewroom", AddNewRoom);
router.get("/getallrooms", GetAllRooms);
router.get("/getroombyid/:id", GetRoomById);
router.post("/updateroom/:id", UpdateRoom);
router.delete("/deleteroom/:id", DeleteRoom);

module.exports = router;
