const express = require("express");
const path = require("path");
const mainController = require("../controllers/main");
const router = express.Router();

router.get("/", mainController.getIndexPage);

module.exports = router;
