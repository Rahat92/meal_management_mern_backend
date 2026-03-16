const mongoose = require("mongoose");
const DepositModel = require("../../models/v2/depositModel");
const BorderMealModel = require("../../models/v2/borderMealModel");

exports.addDeposit = async (req,res) => {
    try {
        const { borderMeal, amount, reason } = req.body;

        const newDeposit = new DepositModel({
            borderMeal,
            amount,
            reason
        });

        await newDeposit.save();
        res.status(201).json(newDeposit);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.createOrUpdateDeposit = async (req, res) => {
  try {
    console.log(req.body.depositDetails);
    const updatePromises = req.body.depositDetails.map(async (item) => {
      const {
        id,
        borderMeal,
        amount,
        reason,
        removeItem
      } = item;

      if (!borderMeal || !amount) return null;

      const isValidObjectId =
        typeof id === "string" &&
        mongoose.Types.ObjectId.isValid(id) &&
        new mongoose.Types.ObjectId(id).toString() === id;


      // DELETE CASE
      if (removeItem) {
        if (isValidObjectId) {
          await DepositModel.deleteOne({ _id: id });
        }
        return { deleted: true, borderMeal };
      }

      // UPDATE / CREATE CASE
      const filter = isValidObjectId
        ? { _id: id }
        : { _id: new mongoose.Types.ObjectId() };

      console.log("filter", filter);

      const newDoc = await DepositModel.findOneAndUpdate(
        filter,
        {
          $set: {
            borderMeal,
            amount,
            reason
          }
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );


      return newDoc;

    });

    const updatedRecords = await Promise.all(updatePromises);
    console.log("updatedRecords", updatedRecords);
    const validRecords = updatedRecords.filter(r => r && !r.deleted);

    // calculate total
    const totalDeposit = validRecords.reduce((sum, record) => {
      return sum + Number(record.amount || 0);
    }, 0);

    // find borderMeal safely
    const mealId =
      validRecords[0]?.borderMeal ||
      req.body.depositDetails.find(e => e.borderMeal)?.borderMeal;

    if (mealId) {
      await BorderMealModel.findByIdAndUpdate(
        mealId,
        {
          $set: {
            "money": totalDeposit
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedRecords.filter(Boolean)
    });

  } catch (error) {
    console.error("Error in createOrUpdateDeposit:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};