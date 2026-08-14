const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminAnalyticsController");
const adminUserController = require("../controllers/adminUserController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Admin Only Route
router.get("/", authenticate, authorize("ADMIN"), controller.getAnalytics);

router.post("/create-user", authenticate, authorize("ADMIN"), adminUserController.createUser);

module.exports = router;