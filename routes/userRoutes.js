const express = require('express');
const { signUp, logIn, protect, logOut, getBorders } = require('../controllers/userController');
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
    .route('/logout')
    .get(logOut)
const userRouter = router;
module.exports = userRouter