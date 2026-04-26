const mongoose = require('mongoose');

const mealMonthUserSchema = new mongoose.Schema({
    mealMonth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealMonth",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// prevent duplicate user per month
mealMonthUserSchema.index({ mealMonth: 1, user: 1, manager: 1 }, { unique: true });

const MealMonthUserModel = mongoose.model("MealMonthUser", mealMonthUserSchema);
module.exports = MealMonthUserModel;