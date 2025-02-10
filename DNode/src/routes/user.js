const express = require("express");
const { signupUser, generateOTPForPhone } = require("../controller/user");
const { validatePhone } = require("../middleware/user");

const router = express.Router();

// Define the signup route
router.post("/otp",validatePhone, generateOTPForPhone);
router.post("/signup",validatePhone, signupUser);

module.exports = router;
