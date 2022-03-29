const express = require('express');

const chats = require("./data/data")
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db")
const colors = require("colors")
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const chatRoutes = require("./routes/chatRoutes")
const path = require('path')
dotenv.config();

app.use(express.json())//server to accept json data
app.use(cors())

//making connection with db fikle comming from config folder
connectDB()




app.use("/api/user", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/message", messageRoutes)



//--------------------------- deployment---------------------------------------------------
const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/frontend/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
    );
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}
//--------------------------- deployment---------------------------------------------------

//ERROR HANDLING middleware
app.use(notFound)
app.use(errorHandler)


const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
    console.log("server started on port 5000".yellow.bold)
})

const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
})

io.on("connection", (socket) => {
    console.log("connected to socket.io")

    //everytime user open app  he/she shoudl be connected to personal socket
    socket.on("setup", (userData) => {
        //create new room for user
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit("connected")

    })

    socket.on("join chat", (room) => {
        //take room Id from frontend
        socket.join(room);
        console.log("user joined room : " + room);
    })

    //new socket for typing
    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("new message", (newMessageRecieved) => {
        //whcih chat this belongs to
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved)
        })



    })

    //consume lot of bandwidth so best practice
    socket.off("setup", () => {
        console.log("disconnected")
        socket.leave(userData._id)
    })
})
//after setup install client version of socket.io