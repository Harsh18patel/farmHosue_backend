const express = require("express");
const { searchProperty, searchByName } = require("../controller/search");


const router = express.Router();

router.post("/",  searchProperty);
router.post("/byname",  searchByName);

module.exports = router;
