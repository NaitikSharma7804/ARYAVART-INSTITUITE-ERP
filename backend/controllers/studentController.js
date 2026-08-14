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

// DELETE student
const deleteStudent = async (req, res) => {
    try {
        await db.query("DELETE FROM students WHERE student_id = ?", [req.params.id]);
        res.json({ success: true, message: "Student deleted." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const updateStudent = async (req, res) => {
    try {
        const { full_name, phone, roll_no, class_id, batch_id } = req.body;
        await db.query(
            "UPDATE students SET full_name=?, phone=?, roll_no=?, class_id=?, batch_id=? WHERE student_id=?",
            [full_name, phone, roll_no, class_id, batch_id, req.params.id]
        );
        res.json({ success: true, message: "Student updated." });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports={

    getStudents,

    addStudent,
    updateStudent,
    deleteStudent

};