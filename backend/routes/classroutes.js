const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const controller = require("../controllers/classController");

// Define each route exactly once
// routes/classRoutes.js
router.get(
    "/",
    authenticate,
    authorize("ADMIN"),
    controller.getBatches // Use getBatches, not getClasses
);

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    controller.createBatch // Use createBatch, not addClass
);
module.exports = router;