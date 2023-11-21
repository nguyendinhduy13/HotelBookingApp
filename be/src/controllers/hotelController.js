const Hotel = require("../models/hotel");
const Comments = require("../models/comment");
const AddNewHotel = async (req, res) => {
  try {
    const {
      id,
      name,
      advantage,
      comments,
      description,
      image,
      rooms,
      isactive,
      address,
      position,
      tag,
    } = req.body;
    const hotel = new Hotel({
      id,
      name,
      advantage,
      comments,
      description,
      image,
      rooms,
      isactive,
      address,
      position,
      tag,
    });
    const oldHotel = await Hotel.find({ id: id });
    if (oldHotel.length !== 0) {
      return res.status(400).send({ message: "Hotel already exists" });
    } else {
      await hotel.save();
      return res.status(200).send(hotel);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const GetAllHotel = async (req, res) => {
  var hotels = await Hotel.find().populate("rooms").populate("vehicles").populate("comments");

  hotels = await Comments.populate(hotels, {
    path: "comments.id_user",
    select: "name",
  });
  hotels = await Comments.populate(hotels, {
    path: "comments.id_room",
    select: "name",
  });
  res.status(200).send(hotels);
};

const GetByID = async (req, res) => {
  let hotel = await Hotel.findById(req.params.id).populate("rooms").populate("vehicles").populate("comments");
  hotel = await Comments.populate(hotel, {
    path: "comments.id_user",
    select: "name",
  });
  hotel = await Comments.populate(hotel, {
    path: "comments.id_room",
    select: "name",
  });
  res.status(200).send(hotel);
};

const FindHotelByActive = async (req, res) => {
  const hotel = await Hotel.find({ isactive: false });
  res.status(200).send(hotel);
};

const UpdateActive = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  hotel.isactive = !hotel.isactive;
  hotel.save();
  res.status(200).send(hotel);
};

const AddIDRoom = async (req, res) => {
  const hotel = await Hotel.find({ id: req.body.id });
  hotel[0].rooms.push(req.body.rooms);
  hotel[0].save();
  res.status(200).send(hotel);
};

const DeleteHotel = async (req, res) => {
  const hotel = await Hotel.findByIdAndDelete(req.params.id);
  res.status(200).send({ message: "Delete hotel successfully" });
};

const UpdateHotel = async (req, res) => {
  const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body);
  //return newest data
  const newHotel = await Hotel.findById(req.params.id);
  res.status(200).send(newHotel);
};

module.exports = {
  AddNewHotel,
  GetAllHotel,
  GetByID,
  FindHotelByActive,
  UpdateActive,
  AddIDRoom,
  DeleteHotel,
  UpdateHotel,
};
