const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
    name: String,
    quantity: Number
})