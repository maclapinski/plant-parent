const express = require("express");
const path = require("path");
const mainController = require("../controllers/main");
const router = express.Router();

router.get("/", mainController.getIndexPage);

router.post('/add-to-plants', mainController.postAddToPlants)
router.post('/delete-from-plant-list', mainController.postDeleteFromPlantList)

module.exports = router;
