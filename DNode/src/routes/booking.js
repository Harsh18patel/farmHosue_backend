const express = require("express");
const authenticateToken = require("../auth/auth");
const { bookingProperty } = require("../controller/booking");


const router = express.Router();

router.post("/book", authenticateToken, bookingProperty);

module.exports = router;
