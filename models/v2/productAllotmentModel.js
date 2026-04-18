const mongoose = require("mongoose");

const ProductAllotmentSchema = new mongoose.Schema({

    mealManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductCategory",
        required: true,
        index: true
    },

    mealMonth: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },

    estimatedAmount: {
        type: Number,
        required: true
    },

    note: {
        type: String
    }

}, { timestamps: true });


ProductAllotmentSchema.index(
    { mealManager: 1, category: 1, year: 1, month: 1 },
    { unique: true }
);

module.exports = mongoose.model("ProductAllotment", ProductAllotmentSchema);