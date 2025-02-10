const express = require("express");
const {createProperties, getPropertyType, favoriteProperty, upload } = require("../controller/property");
const authenticateToken = require("../auth/auth");


const router = express.Router();

// Define the signup route
router.post("/",upload.array('property_images'),createProperties);
router.get("/gets", getPropertyType);

router.post("/add",authenticateToken, favoriteProperty)

module.exports = router;
