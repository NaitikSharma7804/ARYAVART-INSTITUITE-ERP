const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentTimetableController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Only students can access this specific route
router.get("/", authenticate, authorize("STUDENT"), controller.getTimetable);

module.exports = router;