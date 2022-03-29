const asyncHandler = require("express-async-handler")
const User = require("../model/userModel")
const generateToken = require("../config/generateToken")
const registerUser = asyncHandler(async (req, res) => {
    //destructure from req.body
    const { name, email, password, pic } = req.body

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter All Fields!!!")
    }
    //check if user already exist in database
    const userExist = await User.findOne({ email })
    if (userExist) {
        res.status(400);
        throw new Error("This user is already exist!!!")
    }
    //create new user

    const user = await User.create({ name, email, password, pic });
    if (user) {
        res.status(201).json({ _id: user._id, name: user.name, email: user.email, pic: user.pic, token: generateToken(user._id) })
    } else {
        res.status(400);
        throw new Error("Failed to Create User")
    }
})


//login

const authLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //find user idf it exits in db or not

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id, name: user.name, email: user.email, pic: user.pic, token: generateToken(user._id)

        })
    } else {
        res.status(404);
        throw new Error("Invalid Credentials!!!")
    }

})


//allUsers
//api/user?search=aniket
const allUsers = asyncHandler(async (req, res) => {

    const keyWord = req.query.search ? {
        $or: [
            //search query either inside email or name if it matches return
            { name: { $regex: `${req.query.search}`, $options: "i" } },
            { email: { $regex: `${req.query.email}`, $options: "i" } }
        ]
    } : {}
    //its like if else
    //query the db
    //find all search except logged in use find({_id:{$ne:req.user._id}})
    const users = await User.find(keyWord).find({ _id: { $ne: req.user._id } })
    res.send(users)
});

module.exports = { registerUser, authLogin, allUsers };