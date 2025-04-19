const mongoose = require("mongoose");

const userMealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  money: {
    type: Number,
    default: 0,
  },
  shop: {
    type: Number,
    default: 0,
  },
  extraShop: {
    type: Number,
    default: 0,
  },
  recipe: {
    breakfast: {
      items: [
        {
          item: {
            type: mongoose.Schema.ObjectId,
            ref: 'Item',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      note: { type: String },
    },
    launch: {
      items: [
        {
          item: {
            type: mongoose.Schema.ObjectId,
            ref: 'Item',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      note: { type: String },
    },
    dinner: {
      items: [
        {
          item: {
            type: mongoose.Schema.ObjectId,
            ref: 'Item',
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
      note: { type: String },
    },
  }
}, { _id: false });

const newMealSchema = new mongoose.Schema({
  date: {
    type: String,
    required: [true, "Must have a date"],
    unique: true,
  },
  month: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  mealManager: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  borders: [userMealSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

const Meal = mongoose.model("NewMessMeal", newMealSchema);
module.exports = Meal;
