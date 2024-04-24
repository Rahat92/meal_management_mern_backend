const Message = require("../models/messageModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createMessage = catchAsyncError(async (req, res) => {
    const newMessage = await Message.create({
        conversationId: req.body.conversationId,
        sender: req.body.sender,
        message: req.body.message,
    });
    res.status(200).json({
        status: "success",
        data: {
            newMessage,
        },
    });
})

exports.getMessages = catchAsyncError(async (req, res) => { 
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).json({
        status: "success",
        results: messages.length,
        data: {
            messages,
        },
    });
});