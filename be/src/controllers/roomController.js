const Room = require("../models/room");
const Hotel = require("../models/hotel");
const { GetAllHotel } = require("./hotelController");

const AddNewRoom = async (req, res) => {
  const {
    name,
    price,
    description,
    utility,
    image,
    isactive,
    hotel_id,
    tag,
  } = req.body;
  const room = new Room({
    name,
    price,
    description,
    image,
    utility,
    isactive,
    hotel_id,
    tag,
  });
  const hotel = await Hotel.find({ id: hotel_id });
  hotel[0].rooms.push(String(room._id));
  hotel[0].save();
  room.save();
  res.status(200).send(room);
};

const UpdateRoom = async (req, res) => {
  try{
  const {
    name,
    price,
    description,
    utility,
    image,
    isactive,
    hotel_id,
    tag,
  } = req.body;
  const room = await Room.findByIdAndUpdate(
    req.params.id,
    {
      name,
      price,
      description,
      utility,
      image,
      isactive,
      hotel_id,
      tag,
    }
  );
  res.status(200).json({ success: true, data: room });
} catch (error) {
  res.status(500).json({ success: false, message: error.message });
}
}

const DeleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    const hotel = await Hotel.findOne({ rooms: req.params.id });
    const hotelupdate = await Hotel.findByIdAndUpdate(hotel._id, {
      $pull: { rooms: req.params.id },
    });
    hotelupdate.save();
    res.status(200).json({ success: true, message: "Delete room success" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


const GetAllRooms = async (req, res) => {
  const rooms = await Room.find();
  res.status(200).send(rooms);
};

const GetRoomById = async (req, res) => {
  const room = Room.findById(req.params.id);
  res.status(200).send(room);
};

module.exports = { AddNewRoom, GetAllRooms, GetRoomById,UpdateRoom,DeleteRoom };
