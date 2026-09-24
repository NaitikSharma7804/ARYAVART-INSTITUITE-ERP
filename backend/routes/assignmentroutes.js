const express = require("express");

const router = express.Router();

const auth = require("../middleware/authmiddleware");
const authorize = require("../middleware/authorize");

const controller = require("../controllers/assignmentcontroller");

router.get(
    "/",
    auth,
    authorize("ADMIN"),
    controller.getAssignments
);

router.post(
    "/",
    auth,
    authorize("ADMIN"),
    controller.createAssignment
);

router.delete(
    "/:id",
    auth,
    authorize("ADMIN"),
    controller.deleteAssignment
);

module.exports = router;