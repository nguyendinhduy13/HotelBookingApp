const Message = require("../models/message");
const User = require("../models/user");

const getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const user = await User.findById(to);

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message,
        time: msg.updatedAt,
      };
    });
    res.json({
      messages: projectedMessages,
      user: {
        id: user?._id,
        name: user?.name,
        avatar: user?.avatar,
      },
    });
  } catch (ex) {
    next(ex);
  }
};

const addMessage = async (req, res, next) => {
  try {
    const { from, fromType, to, toType, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      senderType: fromType,
      receiver: to,
      receiverType: toType,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Message.findByIdAndDelete(id);
    if (data) return res.json({ msg: "Message deleted successfully." });
    else return res.json({ msg: "Failed to delete message from the database" });
  } catch (error) {
    next(ex);
  }
};

const getAllMessages = async (req, res, next) => {
  try {
    const { id_sender } = req.body;

    // Lấy tin nhắn mới nhất của mỗi cuộc trò chuyện và thông tin người dùng
    const messages = await Message.aggregate([
      {
        $match: {
          users: { $in: [id_sender] },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: [{ $arrayElemAt: ["$users", 0] }, id_sender] },
              then: { $arrayElemAt: ["$users", 1] },
              else: { $arrayElemAt: ["$users", 0] },
            },
          },
          message: {
            $first: {
              $cond: {
                if: { $eq: [{ $arrayElemAt: ["$users", 0] }, id_sender] },
                then: {
                  text: "$message.text",
                  sender: true,
                },
                else: {
                  text: "$message.text",
                  sender: false,
                },
              },
            },
          },
          updatedAt: { $first: "$updatedAt" },
        },
      },
    ]);

    const populatedMessages = await Message.populate(messages, {
      path: "_id",
      model: User,
      select: "_id name avatar",
    });

    res.json(populatedMessages);
  } catch (ex) {
    next(ex);
  }
};

const deleteAllMessages = async (req, res, next) => {
  const { id_sender, id_receiver } = req.body;

  try {
    await Message.deleteMany({
      users: {
        $all: [id_sender, id_receiver],
      },
    });

    return res.json({ msg: "Messages deleted successfully." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  addMessage,
  deleteMessage,
  getAllMessages,
  deleteAllMessages,
};
