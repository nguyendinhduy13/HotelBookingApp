const User = require("../models/user");

const checkComment = async (req, res, next) => {
  const { id_user, id_room } = req.body;
  try {
    const user = await User.findById(id_user);
    if (user.orders.includes(id_room)) {
      next();
    } else {
      res.status(403).send("You have not booked this room");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
};

module.exports = checkComment;
