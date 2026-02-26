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
}, { timestamps: true });

mealDaySchema.index({ mealMonth: 1, day: 1 }, { unique: true });

module.exports = mongoose.model("MealDay", mealDaySchema);