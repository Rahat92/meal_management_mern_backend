const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createConversation = catchAsyncError(async (req, res) => {
    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });
    
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
})

exports.getConversations = catchAsyncError(async (req, res) => {
    const conversations = await Conversation.find({
        members: { $in: [req.params.id] },
    });
    const members = conversations.map(el => {
        return el.members = el.members.find(member => member !== req.params.id);
    })
    const chatFrnds =await Promise.all(members.map(async el => {
        return await User.findById(el);
    }))
    res.status(200).json({
        status: "success",
        results: conversations.length,
        data: {
            chatFrnds: chatFrnds,
            conversations,
        },
    });
})