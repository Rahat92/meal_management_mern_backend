const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    bnName: {
        type: String,
        // required: true,
        default: "",
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productCategorySchema.virtual('productTags', {
    ref: 'ProductsTag',
    localField: '_id',
    foreignField: 'category'
});
const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;