const express = require('express');
const { createMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

router
    .route('/')
    .post(createMessage)

router
    .route('/:id')
    .get(getMessages)

const messageRouter = router;
module.exports = messageRouter