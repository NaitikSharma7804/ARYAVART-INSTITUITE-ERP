const express = require("express");

const router = express.Router();

const controller = require("../controllers/videoController");

const authenticate = require("../middleware/authmiddleware");

const authorize = require("../middleware/rolemiddleware");

/*
=====================================
Teacher Assignment Dropdown
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
Teacher Videos
=====================================
*/

router.get(

    "/",

    authenticate,

    authorize("TEACHER"),

    controller.getTeacherVideos

);

/*
=====================================
Single Video
=====================================
*/

router.get(

    "/:id",

    authenticate,

    authorize("TEACHER"),

    controller.getVideo

);

/*
=====================================
Upload Video
=====================================
*/

router.post(

    "/",

    authenticate,

    authorize("TEACHER"),

    controller.uploadVideo

);

/*
=====================================
Update Video
=====================================
*/

router.put(

    "/:id",

    authenticate,

    authorize("TEACHER"),

    controller.updateVideo

);

/*
=====================================
Delete Video
=====================================
*/

router.delete(

    "/:id",

    authenticate,

    authorize("TEACHER"),

    controller.deleteVideo

);

module.exports = router;