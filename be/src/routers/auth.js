const express = require("express");
const auth = require("../middleware/auth");

const {
  Register,
  Login,
  Logout,
  GetAllUser,
  GetSingleUser,
  CheckLogin,
  UpdateProfile,
  ChangePassword,
  UpdateTokenNotification,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.get("/getalluser", GetAllUser);
router.get("/getuser/:id", GetSingleUser);
router.post("/checkLogin", auth, CheckLogin);
router.post("/updateProfile", UpdateProfile);
router.post("/changePassword", ChangePassword);
router.post("/updateTokenNotification", UpdateTokenNotification);
router.get("/logout", Logout);

module.exports = router;
