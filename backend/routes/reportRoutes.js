const express = require("express");
const router = express.Router();
const controller = require("../controllers/reportController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Admin Only Route
router.get("/:type", authenticate, authorize("ADMIN"), controller.generateReport);

module.exports = router;