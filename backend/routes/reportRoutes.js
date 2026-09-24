const express = require("express");
const router = express.Router();
const controller = require("../controllers/reportController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Admin Only Route
router.get("/:type", authenticate, authorize("ADMIN"), controller.generateReport);

module.exports = router;