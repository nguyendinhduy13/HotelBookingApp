const express = require("express");

const {
        AddNewVehicle,
        UpdateVehicle,
        DeleteVehicle,
        GetAllVehicles,
        GetVehicleByIdHotel
} = require("../controllers/vehicleController");

const router = express.Router();

router.get("/getallvehicles", GetAllVehicles);
router.get("/getvehiclebyidhotel/:id_hotel", GetVehicleByIdHotel)
router.post("/addnewvehicle", AddNewVehicle);
router.post("/updatevehicle/:id", UpdateVehicle);
router.delete("/deletevehicle/:id", DeleteVehicle);

module.exports = router;
