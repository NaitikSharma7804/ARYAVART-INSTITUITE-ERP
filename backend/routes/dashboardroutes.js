const express = require("express");

const router = express.Router();

const auth = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const controller = require("../controllers/dashboardController");

router.get(
    "/stats",
    auth,
    authorize("ADMIN"),
    controller.getDashboard
);

module.exports = router;