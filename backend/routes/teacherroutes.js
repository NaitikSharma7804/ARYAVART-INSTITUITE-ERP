const express = require("express");

const router = express.Router();

const auth = require("../middleware/authmiddleware");

const authorize = require("../middleware/authorize");

const controller = require("../controllers/teachercontroller");

router.get(
    "/",
    auth,
    authorize("ADMIN"),
    controller.getTeachers
);

router.post(
    "/",
    auth,
    authorize("ADMIN"),
    controller.createTeacher
);

router.delete(
    "/:id",
    auth,
    authorize("ADMIN"),
    controller.deleteTeacher
);

router.get(
    "/:id",
    auth,
    authorize("ADMIN"),
    controller.getTeacher
);

router.put(
    "/:id",
    auth,
    authorize("ADMIN"),
    controller.updateTeacher
);

module.exports = router;