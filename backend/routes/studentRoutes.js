const express=require("express");

const router=express.Router();

const authenticate=require("../middleware/authmiddleware");

const authorize=require("../middleware/authorize");

const controller=require("../controllers/studentController");
const studentController = require("../controllers/studentController");
console.log("DEBUG: Controller content:", studentController);

router.get(

"/",

authenticate,

authorize("ADMIN"),

controller.getStudents

);

router.post(

"/",

authenticate,

authorize("ADMIN"),

controller.addStudent

);

router.delete("/:id", studentController.deleteStudent);
router.put("/:id", studentController.updateStudent);

module.exports=router;