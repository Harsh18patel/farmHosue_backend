const express = require("express");
const authenticateToken = require("../auth/auth");
const { reviewProperty } = require("../controller/review");


const router = express.Router();

router.post("/", authenticateToken, reviewProperty);

module.exports = router;
