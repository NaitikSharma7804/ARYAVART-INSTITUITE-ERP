const Batch = require("../models/batchmodel");

exports.createBatch = async (req, res) => {
    try {
        const { batch_name, class_id, capacity } = req.body;
        
        // Ensure you are passing all 3 fields to the model
        await Batch.addBatch(batch_name, class_id, capacity);
        
        res.json({ success: true, message: "Batch created successfully!" });
    } catch (err) {
        console.error("Batch Creation Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getBatches = async (req, res) => {
    try {
        const batches = await Batch.getBatches();
        res.json({ success: true, batches });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};