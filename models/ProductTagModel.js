const mongoose = require('mongoose');
const productTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ProductsTag = mongoose.model('ProductsTag', productTagSchema);

module.exports = ProductsTag;