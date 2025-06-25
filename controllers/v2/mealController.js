const Item = require("../../models/itemModel");
const mongoose = require("mongoose");
const Meal = require("../../models/newMealModel");

// Create a new meal document for the day
exports.createMeal = async (req, res) => {
    try {
        const {
            date,
            month,
            year,
            day,
            mealManager,
            borders, // array of users with their meals and recipe
        } = req.body;

        // Optional: Check if a meal already exists for this date
        const existing = await Meal.findOne({ date });
        if (existing) {
            return res.status(400).json({ message: "Meal already exists for this date." });
        }

        // // Validate item references (optional but safe)
        // for (const border of borders) {
        //     for (const period of ["breakfast", "launch", "dinner"]) {
        //         const recipeItems = border.recipe?.[period]?.items || [];

        //         for (const itemObj of recipeItems) {
        //             const itemExists = await Item.findById(itemObj.item);
        //             if (!itemExists) {
        //                 return res.status(404).json({ message: `Item not found: ${itemObj.item}` });
        //             }
        //         }
        //     }
        // }

        const newMeal = await Meal.create({
            date,
            month,
            year,
            day,
            mealManager,
            borders,
        });

        res.status(201).json({
            message: "Meal created successfully.",
            data: newMeal,
        });

    } catch (err) {
        console.error("Create Meal Error:", err);
        res.status(500).json({
            message: "Failed to create meal.",
            error: err.message,
        });
    }
};



exports.updateUserLunch = async (req, res) => {
    // const { date } = req.params;
    const date = '2025-04-18';
    // const userId = req.user._id;
    const userId = '661f3b4e2f41d2530aa6e330';
    const { items, note } = req.body;
  
    try {
      const result = await Meal.updateOne(
        { date, "borders.user": userId },
        {
          $set: {
            "borders.$.recipe.launch.items": items,
            "borders.$.recipe.launch.note": note,
          }
        }
      );
  
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'User meal not found for this date' });
      }
  
      res.status(200).json({ message: 'Lunch updated successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating lunch', error: err.message });
    }
  };
  