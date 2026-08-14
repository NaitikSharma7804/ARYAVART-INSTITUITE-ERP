const db = require("../config/db");

/*
=====================================
Teacher Assignments
=====================================
*/

async function getTeacherAssignments(userId) {

    const [rows] = await db.query(

        `
        SELECT

            ts.id AS teacher_subject_id,

            s.subject_name,

            b.batch_name

        FROM teachers t

        JOIN teacher_subject ts
            ON t.teacher_id = ts.teacher_id

        JOIN subjects s
            ON ts.subject_id = s.subject_id

        JOIN batches b
            ON ts.batch_id = b.batch_id

        WHERE t.user_id=?

        ORDER BY
            b.batch_name,
            s.subject_name
        `,

        [userId]

    );

    return rows;

}

/*
=====================================
Upload Video
=====================================
*/

async function uploadVideo(data){

    const [result] = await db.query(

        `
        INSERT INTO videos
        (

            teacher_subject_id,

            title,

            description,

            video_type,

            video_url

        )

        VALUES
        (
            ?,?,?,?,?
        )
        `,

        [

            data.teacher_subject_id,

            data.title,

            data.description,

            data.video_type,

            data.video_url

        ]

    );

    return result.insertId;

}

/*
=====================================
Teacher Videos
=====================================
*/

async function getTeacherVideos(userId){

    const [rows] = await db.query(

        `
        SELECT

            v.video_id,

            v.title,

            v.description,

            v.video_type,

            v.video_url,

            v.created_at,

            s.subject_name,

            b.batch_name

        FROM videos v

        JOIN teacher_subject ts
            ON v.teacher_subject_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        JOIN subjects s
            ON ts.subject_id = s.subject_id

        JOIN batches b
            ON ts.batch_id = b.batch_id

        WHERE t.user_id=?

        ORDER BY v.created_at DESC
        `,

        [userId]

    );

    return rows;

}

/*
=====================================
Single Video
=====================================
*/

async function getVideoById(videoId,userId){

    const [rows] = await db.query(

        `
        SELECT

            v.*

        FROM videos v

        JOIN teacher_subject ts
            ON v.teacher_subject_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        WHERE

            v.video_id=?

            AND

            t.user_id=?

        `,

        [

            videoId,

            userId

        ]

    );

    return rows[0];

}

/*
=====================================
Update Video
=====================================
*/

async function updateVideo(data){

    await db.query(

        `
        UPDATE videos

        SET

            teacher_subject_id=?,

            title=?,

            description=?,

            video_type=?,

            video_url=?

        WHERE

            video_id=?

        `,

        [

            data.teacher_subject_id,

            data.title,

            data.description,

            data.video_type,

            data.video_url,

            data.video_id

        ]

    );

}

/*
=====================================
Delete Video
=====================================
*/

async function deleteVideo(videoId,userId){

    const [result] = await db.query(

        `
        DELETE v

        FROM videos v

        JOIN teacher_subject ts
            ON v.teacher_subject_id = ts.id

        JOIN teachers t
            ON ts.teacher_id = t.teacher_id

        WHERE

            v.video_id=?

            AND

            t.user_id=?

        `,

        [

            videoId,

            userId

        ]

    );

    return result.affectedRows;

}

module.exports={

    getTeacherAssignments,

    uploadVideo,

    getTeacherVideos,

    getVideoById,

    updateVideo,

    deleteVideo

};