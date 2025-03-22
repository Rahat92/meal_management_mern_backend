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
    day: {
      type: Number,
      required: [true, "Must have a day"],
    },
    // border: [
    //   {
    //     type: Object,
    //     required: [true, "Must have a border"],
    //   },
    // ],
    border: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Meal must belong to at least one user']
      }
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
    extraShop: [
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
