const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authenticate = require("./middleware/authMiddleware");
const dashboardRoutes=require("./routes/dashboardRoutes");

require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const classRoutes = require("./routes/classRoutes");

const app = express();

app.use(helmet());

app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Aryavart Institute ERP API"
    });
});

/*
===================================
TEMPORARY TEST ROUTE
===================================
*/

app.get("/api/test", authenticate, (req, res) => {

    res.json({

        success: true,

        message: "Protected Route Working",

        user: req.user

    });

});
app.use("/api/classes", classRoutes);

app.use(

"/api/dashboard",

dashboardRoutes

);

app.use(

    "/api/students",

    studentRoutes

);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server Running on Port ${PORT}`);
});