const jwt = require("jsonwebtoken");
const User = require("../model/userModel.js")
const asyncHandler = require("express-async-handler");

//next MOVE ON TO OTHERS OPERATION
const protect = asyncHandler(async (req, res, next) => {
    let token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            //remove bearer and take the token from it

            //decode token id
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            //we find the user in db and return it without password
            next()
        } catch (err) {
            console.log(err);
            res.status(401);
            throw new Error("Not authorized,token failed");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("Not authorized,no token");
    }
})

module.exports = { protect };