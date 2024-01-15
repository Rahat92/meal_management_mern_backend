const express = require('express');
const { signUp, logIn, protect, logOut, getBorders, sendMessage, forgotPassword } = require('../controllers/userController');
const router = express.Router();

router
    .route('/register')
    .post(signUp)
router
    .route('/login')
    .post(logIn)
router
    .route('/')
    .get(getBorders)
router
    .route('/send-message')
    .post(sendMessage)
router
    .route('/logout')
    .get(logOut)
router
    .route('/forgot-password')
    .post(forgotPassword)
const userRouter = router;
module.exports = userRouter