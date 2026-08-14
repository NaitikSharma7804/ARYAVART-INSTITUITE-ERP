const Message = require("../models/messageModel");

exports.getContacts = async (req, res) => {
    try {
        const contacts = await Message.getTeacherParentContacts(req.user.id);
        res.json({ success: true, contacts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getConversation = async (req, res) => {
    try {
        const messages = await Message.getConversation(req.user.id, req.params.userId);
        res.json({ success: true, messages, currentUserId: req.user.id });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { receiver_id, content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }
        await Message.sendMessage(req.user.id, receiver_id, content);
        res.json({ success: true, message: "Message sent" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};