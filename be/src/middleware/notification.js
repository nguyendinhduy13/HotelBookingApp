const FCM = require("fcm-node");
const serverKey = process.env.serverKeyNotification;
const fcm = new FCM(serverKey);

const sendNotification = (req, res) => {
  const { token, title, data, body } = req.body;
  try {
    const message = {
      to: token,
      notification: {
        title: title,
        body: body,
      },
      data: data,
    };
    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!");
        return res.status(400).send({
          message: "Something has gone wrong!",
        });
      } else {
        console.log("Successfully sent with response: ", response);
        res.status(200).send({
          message: "Successfully sent with response: ",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Something has gone wrong!",
    });
  }
};

module.exports = sendNotification;
