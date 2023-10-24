const express = require("express");

const {
  AddNewHotel,
  GetAllHotel,
  GetByID,
  FindHotelByActive,
  UpdateActive,
  AddIDRoom,
  DeleteHotel,
  UpdateHotel,
} = require("../controllers/hotelController");

const router = express.Router();

router.post("/addnewhotel", AddNewHotel);
router.get("/getall", GetAllHotel);
router.get("/getbyid/:id", GetByID);
router.get("/getbyactive", FindHotelByActive);
router.delete("/delete/:id", DeleteHotel);
router.put("/updateactive/:id", UpdateActive);
router.put("/addidroom", AddIDRoom);
router.put("/update/:id", UpdateHotel);

module.exports = router;
