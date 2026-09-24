const express = require("express");
const router = express.Router();
const controller = require("../controllers/feeController");
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

// Admin Routes
router.get("/dashboard", authenticate, authorize("ADMIN"), controller.getFeeDashboardData);
router.post("/pay", authenticate, authorize("ADMIN"), controller.recordPayment);

module.exports = router;