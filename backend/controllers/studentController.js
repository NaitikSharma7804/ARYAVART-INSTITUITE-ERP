const Student=require("../models/studentModel");

const getStudents=async(req,res)=>{

    try{

        const students=await Student.getStudents();

        res.json({

            success:true,

            students

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false

        });

    }

};

const addStudent=async(req,res)=>{

    try{

        await Student.addStudent(req.body);

        res.json({

            success:true,

            message:"Student Added"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Unable to add student"

        });

    }

};

module.exports={

    getStudents,

    addStudent

};