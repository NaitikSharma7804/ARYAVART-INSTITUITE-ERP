const express=require("express");

const router=express.Router();

const auth=require("../middleware/authMiddleware");

const authorize=require("../middleware/authorize");

const controller=require("../controllers/attendanceController");

router.get(

"/class/:timetableId",

auth,

authorize("TEACHER","ADMIN"),

controller.getClassStudents

);

router.post(

"/mark",

auth,

authorize("TEACHER","ADMIN"),

controller.markAttendance

);

module.exports=router;