const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentDashboardController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

router.get("/", authenticate, authorize("STUDENT"), controller.getDashboard);

module.exports = router;