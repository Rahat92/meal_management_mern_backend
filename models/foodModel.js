const mongoose = require('mongoose');
const foodSchema = mongoose.Schema({
    name: {
        type:String,
        required: [true, 'Must have a food name'],
        unique: true
    },
    quantity: {
        type: Number,
        required: [true, 'Must have a quantity']
    }
})

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;