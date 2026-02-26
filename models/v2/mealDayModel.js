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
mealDaySchema.virtual('borders', {
    ref: 'User',
    localField: '_id',
    foreignField: 'user'
})

mealDaySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'meal',
    });
    next();
});

const MealDayModel = mongoose.model("MealDay", mealDaySchema);
module.exports = MealDayModel;