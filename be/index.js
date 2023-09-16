const express = require("express");
const app = express();
const cors = require("cors");
const socket = require("socket.io");
const User = require("./src/models/user");
const Hotel = require("./src/models/hotel");
const errorMiddleware = require("./src/middleware/errorMiddleware");
require("dotenv").config();
const config = process.env;

const db = require("./src/config/db");
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(errorMiddleware);
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

async function StartApp() {
  const router = require("./src/routers/index");
  router(app);

  // get ipv4 and update at be and fe
  // const api = require("./src/config/api");
  // const ipv4 = await api.UpdateAPI_URL();

  // const server = app.listen(config, () => {
  //   console.log(`Server is running on port ${config}`);
  // });

  const port = config.PORT || 3000; // Use PORT from env, default to 3000
  const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

  const io = socket(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    },
  });

  global.onlineUsers = new Map();
  io.on("connection", (socket) => {
    console.log("Socket connected: " + socket.id);

    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("leave-room", (userId) => {
      onlineUsers.delete(userId);
      console.log("User disconnected: " + socket.id);
    });

    socket.on("send-msg", async (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-receive", data);
      } else {
        console.log("User is offline");
        const user = await User.findById(data.to);
        if (user) {
          let name = "Hotel Booking Manager";
          if (data.from !== "6442aa5167b30af877e4ee71") {
            await Hotel.findById(data.from).then((hotel) => {
              name = hotel.name;
            });
          }
          const { tokenNotification } = user;
          const FCM = require("fcm-node");
          const serverKey = process.env.serverKeyNotification;
          const fcm = new FCM(serverKey);
          const message = {
            to: tokenNotification,
            notification: {
              title: name,
              body: data.msg,
            },
            data: {
              type: "chat",
              id_chat: data.from,
              id_user: data.to,
            },
          };
          fcm.send(message, function (err, response) {
            if (err) {
              console.log("Something has gone wrong!");
            } else {
              console.log("Successfully sent with response: ", response);
            }
          });
        }
      }
    });

    socket.on("delete-msg", async (data) => {
      const sendUserSocket = onlineUsers.get(data.to);
      if (sendUserSocket) {
        socket.to(sendUserSocket).emit("msg-deleted", data);
      }
    });
  });
}

StartApp();
