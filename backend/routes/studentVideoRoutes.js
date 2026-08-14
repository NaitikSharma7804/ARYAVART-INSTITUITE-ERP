const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentVideoController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Route restricted to STUDENTS
router.get("/", authenticate, authorize("STUDENT"), controller.getVideos);

module.exports = router;