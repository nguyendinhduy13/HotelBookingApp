const express = require("express");
const auth = require("../middleware/auth");
const notification = require("../middleware/notification");

const {
  Register,
  Login,
  checkLogin,
  GetAllAdmin,
  GetAdminById,
  GetAdminByIdHotel,
  UpdateInfoAdmin,
  DeleteAdmin,
} = require("../controllers/adminController");

const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/checkLogin", auth, checkLogin);
router.post(
  "/notification",
  notification
);

router.get("/getall", GetAllAdmin);
router.get("/:id", GetAdminById);
router.get("/hotel/:id", GetAdminByIdHotel);

router.put("/update/:id", UpdateInfoAdmin);

router.delete("/delete/:id", DeleteAdmin);

module.exports = router;
