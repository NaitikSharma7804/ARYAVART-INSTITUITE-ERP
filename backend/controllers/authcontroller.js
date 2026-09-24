const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");

/*
=========================================
REGISTER USER
=========================================
*/

const register = async (req, res) => {

    try {

        const {

            full_name,

            email,

            phone,

            password,

            role

        } = req.body;

        // Check required fields

        if (
            !full_name ||
            !phone ||
            !password ||
            !role
        ) {

            return res.status(400).json({

                success: false,

                message: "Please fill all required fields."

            });

        }

        // Check phone already exists

        const existingPhone = await User.findByPhone(phone);

        if (existingPhone) {

            return res.status(409).json({

                success: false,

                message: "Phone number already registered."

            });

        }

        // Check email already exists

        if (email) {

            const existingEmail = await User.findByEmail(email);

            if (existingEmail) {

                return res.status(409).json({

                    success: false,

                    message: "Email already registered."

                });

            }

        }

        // Encrypt password

        const password_hash = await bcrypt.hash(password, 10);
        //const password_hash = (password === 10);

        // Create user

        const userId = await User.createUser({

            full_name,

            email,

            phone,

            password_hash,

            role

        });

        return res.status(201).json({

            success: true,

            message: "Registration Successful",

            userId

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

/*
=========================================
LOGIN USER
=========================================
*/

const login = async (req, res) => {

    try {

        const {

            phone,

            password

        } = req.body;

        if (!phone || !password) {

            return res.status(400).json({

                success: false,

                message: "Phone and Password required."

            });

        }

        const user = await User.findByPhone(phone);

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid Credentials"

            });

        }
        const isMatch = await bcrypt.compare(

            password,

            user.password_hash

        );
        

        if (!isMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid Credentials"

            });

        }

        const token = jwt.sign(

            {

                id: user.user_id,

                role: user.role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: process.env.JWT_EXPIRES

            }

        );

        return res.json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                id: user.user_id,

                name: user.full_name,

                role: user.role,

                phone: user.phone

            }

        });

    }

    catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    register,

    login

};