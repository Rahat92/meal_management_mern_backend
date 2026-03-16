const express = require("express");
const { addDeposit, createOrUpdateDeposit } = require("../../controllers/v2/depositController");
const router = express.Router();

router
    .route('/')
    .post(createOrUpdateDeposit)

const depositRouter = router;
module.exports = depositRouter;