const Attendance=require("../models/attendanceModel");

exports.getClassStudents=async(req,res)=>{

    try{

        const students=await Attendance.getStudentsForClass(

            req.params.timetableId

        );

        res.json({

            success:true,

            students

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};

exports.markAttendance=async(req,res)=>{

    try{

        await Attendance.markAttendance(

            req.body

        );

        res.json({

            success:true

        });

    }

    catch(err){

        res.status(500).json({

            success:false,

            message:err.message

        });

    }

};