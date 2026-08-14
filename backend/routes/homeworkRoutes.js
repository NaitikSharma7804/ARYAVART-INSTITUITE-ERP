const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const controller = require("../controllers/homeworkController");

router.get(
    "/options",
    authenticate,
    authorize("TEACHER"),
    controller.getAssignments
);

router.post(
    "/",
    authenticate,
    authorize("TEACHER"),
    controller.createHomework
);

router.get(
    "/",
    authenticate,
    authorize("TEACHER"),
    controller.getHomework
);

module.exports = router;