const express = require("express");

const router = express.Router();

const auth = require("../middleware/authmiddleware");

const authorize = require("../middleware/authorize");

const controller = require("../controllers/dashboardcontroller");

router.get(
    "/stats",
    auth,
    authorize("ADMIN"),
    controller.getDashboard
);

module.exports = router;