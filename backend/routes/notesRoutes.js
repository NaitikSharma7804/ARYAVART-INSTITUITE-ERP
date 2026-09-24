const express = require("express");
const router = express.Router();

const controller = require("../controllers/notesController");

const authenticate = require("../middleware/authmiddleware");
const authorize = require("../middleware/rolemiddleware");

const upload = require("../middleware/uploadNotes");

/*
=====================================
Teacher Dropdown
=====================================
*/

router.get(

    "/options",

    authenticate,

    authorize("TEACHER"),

    controller.getOptions

);

/*
=====================================
Teacher Notes List
=====================================
*/

router.get(

    "/",

    authenticate,

    authorize("TEACHER"),

    controller.getTeacherNotes

);

/*
=====================================
Single Note
=====================================
*/

router.get(

    "/:id",

    authenticate,

    authorize("TEACHER"),

    controller.getNote

);

/*
=====================================
Upload Notes
=====================================
*/

router.post(

    "/",

    authenticate,

    authorize("TEACHER"),

    upload.single("pdf"),

    controller.uploadNote

);

/*
=====================================
Update Note
=====================================
*/

router.put(

    "/:id",

    authenticate,

    authorize("TEACHER"),

    upload.single("pdf"),

    controller.updateNote

);

/*
=====================================
Delete Note
=====================================
*/

router.delete(

    "/:id",

    authenticate,

    authorize("TEACHER"),

    controller.deleteNote

);

module.exports = router;