const mongoose = require('mongoose')
const ShoppingModel = require("../../models/v2/shoppingModel");
const BorderMealModel = require('../../models/v2/borderMealModel');

exports.createOrUpdateMealExpenseDetail = async (req, res) => {
  try {
    console.log(req.body);

    const updatePromises = req.body.expenseDetails.map(async (item) => {

      const {
        id,
        borderMeal,
        type,
        productName,
        productCount,
        unitPrice,
        category,
        tags,
        removeProduct
      } = item;

      if (!borderMeal || !productName) return null;

      const isValidObjectId =
        typeof id === "string" &&
        mongoose.Types.ObjectId.isValid(id) &&
        new mongoose.Types.ObjectId(id).toString() === id;

      console.log(`id ${id}`, isValidObjectId);

      // DELETE CASE
      if (removeProduct) {
        if (isValidObjectId) {
          await ShoppingModel.deleteOne({ _id: id });
        }
        return { deleted: true, borderMeal };
      }

      // UPDATE / CREATE CASE
      const filter = isValidObjectId
        ? { _id: id }
        : { _id: new mongoose.Types.ObjectId() };

      console.log("filter", filter);

      const newDoc = await ShoppingModel.findOneAndUpdate(
        filter,
        {
          $set: {
            borderMeal,
            productName,
            productCount: Number(productCount || 0),
            type,
            unitPrice: Number(unitPrice || 0),
            category,
            tags
          }
        },
        {
          new: true,
          upsert: true,
          runValidators: true
        }
      );

      console.log("newDoc", newDoc);

      return newDoc;

    });

    const updatedRecords = await Promise.all(updatePromises);
    console.log("updatedRecords", updatedRecords);
    const validRecords = updatedRecords.filter(r => r && !r.deleted);

    // calculate total
    const totalExpense = validRecords.reduce((sum, record) => {
      return sum + Number(record.unitPrice || 0);
    }, 0);

    console.log("totalExpense", totalExpense);

    // find borderMeal safely
    const mealId =
      validRecords[0]?.borderMeal ||
      req.body.expenseDetails.find(e => e.borderMeal)?.borderMeal;

    if (mealId) {
      await BorderMealModel.findByIdAndUpdate(
        mealId,
        {
          $set: {
            [req.body.type === "regular" ? "shop" : "extraShop"]: totalExpense
          }
        }
      );
    }

    res.status(200).json({
      success: true,
      data: updatedRecords.filter(Boolean)
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const { year, month, category, tag, user } = req.query;

    const matchShopping = {};

    if (category) {
      matchShopping.category = new mongoose.Types.ObjectId(category);
    }

    if (tag) {
      matchShopping.tags = new mongoose.Types.ObjectId(tag);
    }

    const pipeline = [

      // 🔹 Filter category/tag first
      { $match: matchShopping },

      // 🔹 Join BorderMeal
      {
        $lookup: {
          from: "bordermeals",
          localField: "borderMeal",
          foreignField: "_id",
          as: "borderMeal"
        }
      },
      { $unwind: "$borderMeal" },

      // 🔹 Filter user if provided
      ...(user ? [{
        $match: {
          "borderMeal.user": new mongoose.Types.ObjectId(user)
        }
      }] : []),

      // 🔹 Join MealDay
      {
        $lookup: {
          from: "mealdays",
          localField: "borderMeal.mealDay",
          foreignField: "_id",
          as: "mealDay"
        }
      },
      { $unwind: "$mealDay" },

      // 🔹 Filter by month/year
      {
        $match: {
          "mealDay.year": parseInt(year),
          "mealDay.month": parseInt(month)
        }
      },

      // 🔹 Calculate item total
      {
        $addFields: {
          itemTotal: {
            $multiply: [
              "$unitPrice",
              { $toDouble: { $substr: ["$productCount", 0, -2] } }
            ]
          }
        }
      },

      // 🔹 Use FACET to build whole dashboard at once
      {
        $facet: {

          // 1️⃣ Summary Cards
          summary: [
            {
              $group: {
                _id: null,
                totalExpense: { $sum: "$itemTotal" },
                totalTransactions: { $sum: 1 }
              }
            }
          ],

          // 2️⃣ Category Wise
          categorySummary: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$itemTotal" }
              }
            },
            {
              $lookup: {
                from: "productcategories",
                localField: "_id",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: "$category" },
            {
              $project: {
                _id: 0,
                name: "$category.name",
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],

          // 3️⃣ User Wise
          userSummary: [
            {
              $group: {
                _id: "$borderMeal.user",
                total: { $sum: "$itemTotal" }
              }
            },
            {
              $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
              }
            },
            { $unwind: "$user" },
            {
              $project: {
                _id: "$user._id",
                name: "$user.name",
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],

          // 4️⃣ Tag Wise
          tagSummary: [
            { $unwind: "$tags" },
            {
              $group: {
                _id: "$tags",
                total: { $sum: "$itemTotal" }
              }
            },
            {
              $lookup: {
                from: "productstags",
                localField: "_id",
                foreignField: "_id",
                as: "tag"
              }
            },
            { $unwind: "$tag" },
            {
              $project: {
                _id: 0,
                name: "$tag.name",
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],

          // 5️⃣ Recent Transactions
          recent: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
            {
              $lookup: {
                from: "users",
                localField: "borderMeal.user",
                foreignField: "_id",
                as: "user"
              }
            },
            { $unwind: "$user" },
            {
              $project: {
                date: "$mealDay.date",
                product: "$productName",
                amount: "$itemTotal",
                user: "$user.name"
              }
            }
          ]
        }
      }
    ];

    const result = await ShoppingModel.aggregate(pipeline);

    res.json({
      success: true,
      data: result[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to load expense summary"
    });
  }
};