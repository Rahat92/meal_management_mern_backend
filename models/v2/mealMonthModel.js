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
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            active: {
                type: Boolean,
                default: true
            }
        }
    ],
    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open"
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mealMonthSchema.virtual('mealDays', {
    ref: 'MealDay',
    localField: '_id',
    foreignField: 'mealMonth'
})

mealMonthSchema.index({ mealManager: 1, year: 1, month: 1 }, { unique: true });

const MealMonthModel = mongoose.model("MealMonth", mealMonthSchema);
module.exports = MealMonthModel;