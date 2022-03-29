const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const Message = require("../model/messageModel")
const User = require("../model/userModel");
const sendMessage = asyncHandler(async (req, res) => {
    //chatId
    //actual message
    //sender

    const { content, chatId } = req.body;
    if (!content || !chatId) {
        console.log("Invalid Data Passed into request!!!")
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    //query database
    try {
        var message = await Message.create(newMessage);
        // .execPopulate is method on document, while .populate works on query object.
        //.execPopulate() not available in new version
        message = await message.populate("sender", "name pic")
        message = await message.populate("chat")
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        })

        //find by id and update the chat with latest message
        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,

        });
        res.json(message)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }

})



const allMessages = asyncHandler(async (req, res) => {
    try {

        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


module.exports = { sendMessage, allMessages }