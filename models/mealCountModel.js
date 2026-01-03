const mongoose = require("mongoose");
const mealCountSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Must have a date"],
    },
    month: {
      type: Number,
      required: [true, "Must have a month"],
    },
    mealManager: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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
      },
    ],
    shoppingComments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
          required: true

        },
        comment: {
          type: String,
          default: '',
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    extraShop: [
      {
        type: Number,
      }
    ],
    extraShoppingComments: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        comment: {
          type: String,
          default: '',
          trim: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
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

mealCountSchema.index({ date: 1, mealManager: 1 }, { unique: true })
const Meal = mongoose.model("MessMeal", mealCountSchema);

module.exports = Meal;
