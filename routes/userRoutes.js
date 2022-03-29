const express = require('express');

const router = express.Router();
const { registerUser, authLogin, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authMiddleware');
//look for {}
router.route('/').post(registerUser).get(protect, allUsers);
router.post("/login", authLogin)
//protect IS MIDDLESWARE..process must go through the protect before allUsers
module.exports = router;
