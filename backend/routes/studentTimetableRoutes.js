const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentTimetableController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Only students can access this specific route
router.get("/", authenticate, authorize("STUDENT"), controller.getTimetable);

module.exports = router;