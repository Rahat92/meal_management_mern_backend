const mongoose = require('mongoose');
const productTagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nameEn: {
        type: String,
        required: true
    },
    nameBn: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const ProductsTag = mongoose.model('ProductsTag', productTagSchema);

module.exports = ProductsTag;