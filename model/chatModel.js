
//mongoose help to connect to our db and make queries
//chatName
//isGroupChat
//users
//lastestMessage
//groupAdmin

const mongoose = require("mongoose");

const chatModel = mongoose.Schema({
    chatName: {
        type: String,
        trim: true,

    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        //ref to User model
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        //ref to Message model

    },
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }

}, { timestamps: true })


const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;