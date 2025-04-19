const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  unit: {
    type: String,
    default: "pcs", // e.g., kg, gram, pcs, liter
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
