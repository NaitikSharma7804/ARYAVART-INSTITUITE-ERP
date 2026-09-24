const express = require("express");
const router = express.Router();
const controller = require("../controllers/analyticsController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Teacher Analytics Route
router.get("/teacher", authenticate, authorize("TEACHER"), controller.getTeacherAnalytics);

module.exports = router;