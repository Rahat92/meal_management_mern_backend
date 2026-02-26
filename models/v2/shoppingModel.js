const shoppingSchema = new mongoose.Schema({
    borderMeal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorderMeal",
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ["regular", "extra"],
        required: true
    },
    productName: String,
    productCount: String,
    unitPrice: Number,
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory"
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductsTag"
    }]
}, { timestamps: true });

const ShoppingModel = mongoose.model("Shopping", shoppingSchema);
module.exports = ShoppingModel;