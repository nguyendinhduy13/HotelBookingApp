const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PrivateKey = process.env.TOKEN_KEY;
const Register = async (req, res) => {
  try {
    // Get user input
    const { name, phone_number, email, password, type } = req.body;

    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
      return;
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      phone_number,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      type,
    });

    // Create token
    const token = jwt.sign({ user_id: user._id, email }, PrivateKey, {
      expiresIn: "2h",
    });
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
};

const Login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    var user = await User.findOne({ email }).populate("orders");
    user = await Order.populate(user, {
      path: "orders.id_room",
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
};

const CheckLogin = async (req, res) => {
  var user = await User.findOne({ email: req.auth.email }).populate("orders");
  user = await Order.populate(user, {
    path: "orders.id_room",
  });
  res.status(200).send({
    message: "Welcome 🙌 ",
    data: {
      user: user,
    },
  });
};

const GetAllUser = async (req, res) => {
  const users = await User.find().populate("orders");
  res.status(200).send({
    message: "Get all user successfully",
    data: {
      users: users,
    },
  });
};

const GetSingleUser = async (req, res) => {
  try {
    var user = await User.findById(req.params.id).populate("orders");
    user = await Order.populate(user, {
      path: "orders.id_room",
    });
    res.status(200).send({
      message: "Get single user successfully",
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(400).send({
      message: "Get single user failed",
    });
  }
};

const Logout = (req, res) => {
  res.status(200).send("Logout");
};

const UpdateProfile = async (req, res) => {
  const { name, phone_number } = req.body;
  const user = await User.findOne({ email: req.body.email });
  if (name) user.name = name;
  if (phone_number) user.phone_number = phone_number;
  await user.save();
  res.status(200).send({
    message: "Update profile successfully",
    data: {
      user: user,
    },
  });
};

const ChangePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  const user = await User.findOne({ email: req.body.email });
  if (await bcrypt.compare(old_password, user.password)) {
    user.password = await bcrypt.hash(new_password, 10);
    await user.save();
    res.status(200).send({
      message: "Update password successfully",
      data: {
        user: user,
      },
    });
  } else {
    res.status(400).send({
      message: "Old password is not correct",
    });
  }
};

const UpdateTokenNotification = async (req, res) => {
  const { tokenNotification } = req.body;
  const user = await User.findOne({ email: req.body.email });
  user.tokenNotification = tokenNotification;
  await user.save();
  res.status(200).send({
    message: "Update token notification successfully",
  });
};

module.exports = {
  Register,
  Login,
  CheckLogin,
  Logout,
  GetAllUser,
  GetSingleUser,
  UpdateProfile,
  ChangePassword,
  UpdateTokenNotification,
};
