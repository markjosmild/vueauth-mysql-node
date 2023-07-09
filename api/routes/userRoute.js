const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  followUser,
} = require("../controllers/userController");

//test endpoint
router.get("/test", (req, res) => res.json("test success"));

//user endpoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/getch", getProfile);

//user account endpoints
router.post("/follow/:id", followUser);

module.exports = router;
