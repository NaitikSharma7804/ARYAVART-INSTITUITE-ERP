const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const controller = require("../controllers/dashboardController");

router.get(

    "/stats",

    authenticate,

    controller.getStats

);

module.exports = router;