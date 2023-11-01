const AuthRoute = require("./auth");
const AdminRoute = require("./admin");
const HotelRoute = require("./hotels");
const RoomRoute = require("./rooms");
const CommentRoute = require("./comments");
const OrderRoute = require("./orders");
const MessageRoute = require("./messages");
const VehicleRoute = require("./vehicle");
function router(app) {
  app.use("/auth", AuthRoute);
  app.use("/admins", AdminRoute);
  app.use("/hotels", HotelRoute);
  app.use("/rooms", RoomRoute);
  app.use("/comments", CommentRoute);
  app.use("/orders", OrderRoute);
  app.use("/messages", MessageRoute);
  app.use("/vehicle", VehicleRoute);
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  //wrong route
  app.use((req, res) => {
    res.status(404).send({ message: "Route" + req.url + " Not found." });
  });
}

module.exports = router;
