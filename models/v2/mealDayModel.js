const mongoose = require('mongoose')
const mealDaySchema = new mongoose.Schema({
    mealMonth: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealMonth",
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    day: Number,
    month: Number,
    year: Number
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

mealDaySchema.index({ mealMonth: 1, day: 1 }, { unique: true });

// ✅ Correct virtual
mealDaySchema.virtual('borderMeals', {
    ref: 'BorderMeal',
    localField: '_id',
    foreignField: 'mealDay'
});
mealDaySchema.index({ year: 1, month: 1 });
const MealDayModel = mongoose.model("MealDay", mealDaySchema);
module.exports = MealDayModel;