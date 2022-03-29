const jwt = require('jsonwebtoken');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        //IN HOW MUCH TIME IT EXPIRES
        expiresIn: "30d"
    })
}


module.exports = generateToken;