const Video = require("../models/videoModel");

/*
=====================================
Teacher Assignment Options
=====================================
*/

exports.getOptions = async (req, res) => {

    try {

        const assignments = await Video.getTeacherAssignments(req.user.id);

        res.json({

            success: true,

            assignments

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Upload Video
=====================================
*/

exports.uploadVideo = async (req, res) => {

    try {

        await Video.uploadVideo({

            teacher_subject_id: req.body.teacher_subject_id,

            title: req.body.title,

            description: req.body.description,

            video_type: req.body.video_type,

            video_url: req.body.video_url

        });

        res.json({

            success: true,

            message: "Video Uploaded Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Teacher Videos
=====================================
*/

exports.getTeacherVideos = async (req, res) => {

    try {

        const videos = await Video.getTeacherVideos(req.user.id);

        res.json({

            success: true,

            videos

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Single Video
=====================================
*/

exports.getVideo = async (req, res) => {

    try {

        const video = await Video.getVideoById(

            req.params.id,

            req.user.id

        );

        if (!video) {

            return res.status(404).json({

                success: false,

                message: "Video Not Found"

            });

        }

        res.json({

            success: true,

            video

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Update Video
=====================================
*/

exports.updateVideo = async (req, res) => {

    try {

        await Video.updateVideo({

            video_id: req.params.id,

            teacher_subject_id: req.body.teacher_subject_id,

            title: req.body.title,

            description: req.body.description,

            video_type: req.body.video_type,

            video_url: req.body.video_url

        });

        res.json({

            success: true,

            message: "Video Updated Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

/*
=====================================
Delete Video
=====================================
*/

exports.deleteVideo = async (req, res) => {

    try {

        const deleted = await Video.deleteVideo(

            req.params.id,

            req.user.id

        );

        if (!deleted) {

            return res.status(404).json({

                success: false,

                message: "Video Not Found"

            });

        }

        res.json({

            success: true,

            message: "Video Deleted Successfully"

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};