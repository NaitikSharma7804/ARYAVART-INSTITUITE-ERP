const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentAttendanceController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/", authenticate, authorize("STUDENT"), controller.getAttendance);

module.exports = router;