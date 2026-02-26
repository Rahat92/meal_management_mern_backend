const borderMealSchema = new mongoose.Schema({
    mealDay: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealDay",
        required: true,
        index: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    
    breakfast: {
        meal: { type: Number, default: 0 },
        status: { type: String, default: "pending" },
        updatedBy: mongoose.Schema.Types.ObjectId
    },
    lunch: {
        meal: { type: Number, default: 0 },
        status: { type: String, default: "pending" },
        updatedBy: mongoose.Schema.Types.ObjectId
    },
    dinner: {
        meal: { type: Number, default: 0 },
        status: { type: String, default: "pending" },
        updatedBy: mongoose.Schema.Types.ObjectId
    },

    money: { type: Number, default: 0 },
    shop: { type: Number, default: 0 },
    extraShop: { type: Number, default: 0 }

}, { timestamps: true });

borderMealSchema.index({ mealDay: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("BorderMeal", borderMealSchema);