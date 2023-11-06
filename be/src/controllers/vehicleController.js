const Vehicle = require("../models/vehicle");
const Hotel = require("../models/hotel");


const AddNewVehicle = async (req, res) => {
  const { name, brand, specification, price, image, hotel_id, description } =
    req.body;
  const vehicle = new Vehicle({
    name,
    brand,
    specification,
    price,
    image,
    hotel_id,
    description,
  });
  const hotel = await Hotel.find({ id: hotel_id });
  hotel[0].vehicles.push(vehicle._id);
  hotel[0].save();
  vehicle.save();
  res.status(200).send(vehicle);
};


const UpdateVehicle = async (req, res) => {
  try{
  const {
    name,
    brand,
    specification,
    price,
    image,
    hotel_id,
    description,
  } = req.body;
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    {
      name,
      brand,
      specification,
      price,
      image,
      hotel_id,
      description,
    }
  );
  res.status(200).json({ success: true, data: vehicle });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
}

const DeleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    const hotel = await Hotel.findOne({ vehicles: req.params.id });
    const hotelupdate = await Hotel.findByIdAndUpdate(hotel._id, {
      $pull: { vehicles: req.params.id },
    });
    hotelupdate.save();
    res.status(200).json({ success: true, message: "Delete vehicle success" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


const GetAllVehicles = async (req, res) => {
  const vehicles = await Vehicle.find();
  res.status(200).send(vehicles);
};

const GetVehicleByIdHotel = async (req, res) => {
  const vehicles = await Vehicle.find({ hotel_id: req.params.id_hotel });
  res.status(200).send(vehicles);
}


module.exports = {AddNewVehicle,UpdateVehicle,DeleteVehicle,GetAllVehicles,GetVehicleByIdHotel };
