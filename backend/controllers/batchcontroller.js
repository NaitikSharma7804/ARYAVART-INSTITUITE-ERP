const Batch=require("../models/batchmodel");

const getBatches=async(req,res)=>{

    try{

        const batches=await Batch.getAllBatches();

        res.json({

            success:true,

            batches

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Unable to fetch batches"

        });

    }

};

const createBatch=async(req,res)=>{

    try{

        await Batch.createBatch(req.body);

        res.json({

            success:true,

            message:"Batch Added Successfully"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Unable to create batch"

        });

    }

};

const updateBatch=async(req,res)=>{

    try{

        await Batch.updateBatch(

            req.params.id,

            req.body

        );

        res.json({

            success:true,

            message:"Batch Updated"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Unable to update batch"

        });

    }

};

const deleteBatch=async(req,res)=>{

    try{

        await Batch.deleteBatch(

            req.params.id

        );

        res.json({

            success:true,

            message:"Batch Deleted"

        });

    }

    catch(err){

        console.log(err);

        res.status(500).json({

            success:false,

            message:"Unable to delete batch"

        });

    }

};

module.exports={

    getBatches,

    createBatch,

    updateBatch,

    deleteBatch

};