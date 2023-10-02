const Admin = require("../models/admin");
const Hotel = require("../models/hotel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PrivateKey = process.env.TOKEN_KEY;

const Register = async (req, res) => {
  try {
    // Get admin input
    const {
      idHotel,
      name,
      phone_number,
      avatar,
      email,
      country,
      roll,
      password,
    } = req.body;

    // Validate admin input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
      return;
    }
    // check if admin already exist
    // Validate if admin exist in our database
    const oldAdmin = await Admin.findOne({ email });
    if (oldAdmin) {
      return res.status(409).send("Admin Already Exist. Please Login");
    }
    // check if hotel already exist
    const existHotel = await Hotel.findOne({ id: idHotel });
    if (!existHotel) {
      return res.status(409).send("ID Hotel not exist");
    }

    //Encrypt admin password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create admin in our database
    const admin = await Admin.create({
      idHotel,
      name,
      avatar,
      phone_number,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      country,
      roll,
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign({ admin_id: admin._id, email }, PrivateKey, {
      expiresIn: "2h",
    });
    // save admin token
    admin.token = token;

    // return new admin
    res.status(201).json(admin);
  } catch (err) {
    console.log(err);
  }
};

const Login = async (req, res) => {
  try {
    // Get admin input
    const { email, password } = req.body;

    // Validate admin input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if admin exist in our database
    var admin = await Admin.findOne({ email });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      // Create token
      const token = jwt.sign(
        { admin_id: admin._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );

      // save admin token
      admin.token = token;

      // admin
      res.status(200).json(admin);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
};

const checkLogin = async (req, res) => {
  var admin = await Admin.findOne({ email: req.auth.email });
  res.status(200).send({
    message: "Welcome 🙌 ",
    data: {
      admin: admin,
    },
  });
};

const GetAllAdmin = async (req, res) => {
  var admins = await Admin.find();
  admins?.map(async (admin) => {
    var hotel = await Hotel.findOne({ id: admin.idHotel });
    admin.dataHotel.push(hotel);

    // if end of array
    if (admins.indexOf(admin) === admins.length - 1) {
      res.status(200).send({
        message: "Get all admin successfully",
        data: {
          admin: admins,
        },
      });
    }
  });
};

const GetAdminById = async (req, res) => {
  const admin = await Admin.findById(req.params.id);
  if (admin?.idHotel != null) {
    var hotel = await Hotel.findOne({ id: admin.idHotel });
    admin.dataHotel.push(hotel);

    res.status(200).send({
      message: "Get admin by id successfully",
      data: {
        admin: admin,
      },
    });
  }
};

const GetAdminByIdHotel = async (req, res) => {
  const admins = await Admin.find({ idHotel: req.params.id });
  admins.map(async (admin) => {
    if (admin?.idHotel != null) {
      var hotel = await Hotel.findOne({ id: admin.id });
      admin.dataHotel.push(hotel);
    }

    if (admins.indexOf(admin) === admins.length - 1) {
      res.status(200).send({
        message: "Get all admin successfully",
        data: {
          admin: admins,
        },
      });
    }
  });
};

const UpdateInfoAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({
      message: "Update admin successfully",
      data: {
        admin: admin,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Update admin failed",
      data: {
        admin: null,
      },
    });
  }
};

const DeleteAdmin = async (req, res) => {
  const admin = await Admin.findByIdAndDelete(req.params.id);
  res.status(200).send({
    message: "Delete admin successfully",
    data: {
      admin: null,
    },
  });
};

module.exports = {
  Register,
  Login,
  checkLogin,
  GetAllAdmin,
  GetAdminById,
  GetAdminByIdHotel,
  UpdateInfoAdmin,
  DeleteAdmin,
};
