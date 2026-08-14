const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const authorize = require("../middleware/authorize");

const controller = require("../controllers/attendanceController");

router.get(
    "/class/:timetableId",
    authenticate,
    authorize("TEACHER"),
    controller.getStudents
);

router.post(
    "/",
    authenticate,
    authorize("TEACHER"),
    controller.markAttendance
);

module.exports = router;