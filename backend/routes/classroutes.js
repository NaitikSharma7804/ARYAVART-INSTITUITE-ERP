const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");
const controller = require("../controllers/classcontroller");

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