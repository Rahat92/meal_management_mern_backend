const mongoose = require('mongoose');
const foodSchema = mongoose.Schema({
    name: {
        type:String,
        require: [true, 'Must have a food name']
    }
})

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;