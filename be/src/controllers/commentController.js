const Comment = require("../models/comment");
const Hotel = require("../models/hotel");

const AddNewComment = async (req, res) => {
  const { id_user, id_hotel, id_room, content, rating } = req.body;
  const comment = new Comment({
    id_user,
    id_hotel,
    id_room,
    content,
    rating,
  });
  const hotel = await Hotel.find({ id: id_hotel });
  hotel[0].comments.push(String(comment._id));
  hotel[0].save();
  comment.save();
  res.status(200).send(comment);
};

const GetAllComment = async (req, res) => {
  const comments = await Comment.find().populate("user");
  res.status(200).send(comments);
};

module.exports = { AddNewComment, GetAllComment };
