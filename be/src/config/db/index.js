const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
const config = process.env;
const Order=require("../../models/order");

async function connect() {
  var checkIndex = false;
  try {
    await mongoose
      .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connect to database successfully");
        checkIndex = true;
      })
      .catch((error) => {
        console.log("Connect to database failed, retrying...");
        setTimeout(connect, 5000);
      });
    if (checkIndex) {
      // Order.updateMany({}, { $set: { start_date: "", end_date: "" } })
      // .then((result) => {
      //   console.log(result.nModified + ' records updated');
      // })
      // .catch((error) => {
      //   console.error('Failed to update records', error);
      // });
      const collection = mongoose.connection.collection("admins");
      collection.dropIndex("adminks", function (err, result) {
        if (err) {
          // console.log("Error in dropping index!");
        } else {
          console.log("Index dropped successfully!");
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = { connect };
