const express=require("express");

const router=express.Router();

const auth=require("../middleware/authmiddleware");

const authorize=require("../middleware/authorize");

const controller=require("../controllers/teacherDashboardController");

router.get(

"/",

auth,

authorize("TEACHER"),

controller.dashboard

);

module.exports=router;