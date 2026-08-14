const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentDashboardController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", authenticate, authorize("STUDENT"), controller.getDashboard);

module.exports = router;