const mongoose = require("mongoose");
const mealCountSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Must have a date"],
      unique: true,
    },
    month: {
      type: Number,
      required: [true, "Must have a month"],
    },
    mealManager: {
      type: mongoose.Schema.ObjectId,
      required: [true, "Must have a meal manager"],
    },
    year: {
      type: Number,
      required: [true, "Must have a year"],
    },
    border: [
      {
        type: Object,
        required: [true, "Must have a border"],
      },
    ],
    money: [
      {
        type: Number,
      },
    ],
    shop: [
      {
        type: Number,
      }
    ],
    breakfast: [
      {
        type: Array,
        required: [true, "must have a breakfast"],
      },
    ],
    launch: [
      {
        type: Array,
        required: [true, "must have a launch"],
      },
    ],
    dinner: [
      {
        type: Array,
        required: [true, "Must have a dinner"],
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Meal = mongoose.model("MessMeal", mealCountSchema);

module.exports = Meal;
