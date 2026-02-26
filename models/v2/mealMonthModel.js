const mongoose = require("mongoose");

const mealMonthSchema = new mongoose.Schema({
    mealManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    year: {
        type: Number,
        required: true,
        index: true
    },
    month: {
        type: Number,
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
}, { timestamps: true });

mealMonthSchema.index({ mealManager: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("MealMonth", mealMonthSchema);