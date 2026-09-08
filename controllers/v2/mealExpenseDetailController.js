const mongoose = require('mongoose')
const ShoppingModel = require("../../models/v2/shoppingModel");
const BorderMealModel = require('../../models/v2/borderMealModel');

exports.createOrUpdateMealExpenseDetail = async (req, res) => {
  try {

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
            productCount: productCount || "",
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

exports.getMealExpenses = async (req, res) => {
  const mealExpenses = await ShoppingModel.find({ productName: req.query.productName })
}

exports.getExpenseSummary = async (req, res) => {
  try {
    const { year, month, category, tag, user } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 1000, 50);
    const skip = (page - 1) * limit;

    // ============================
    // 🔹 Dynamic Filters
    // ============================
    const matchShopping = {};

    if (category) {
      const catIds = category.split(",").map(id => new mongoose.Types.ObjectId(id));
      matchShopping.category = { $in: catIds };
    }

    if (tag) {
      const tagIds = tag.split(",").map(id => new mongoose.Types.ObjectId(id));
      matchShopping.tags = { $in: tagIds };
    }

    // ============================
    // 🔹 Reusable lookup stages (borderMeal -> user, mealDay -> year/month)
    // Used by the main pipeline AND the "ignore one filter" side-queries below,
    // so all of them stay consistent with each other.
    // ============================
    const buildBaseLookupStages = () => ([
      {
        $lookup: {
          from: "bordermeals",
          let: { borderMealId: "$borderMeal" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$borderMealId"] }
              }
            },
            {
              $lookup: {
                from: "users",
                let: { userId: "$user" },
                pipeline: [
                  {
                    $match: {
                      active: true,
                      $expr: { $eq: ["$_id", "$$userId"] }
                    }
                  },
                  {
                    $project: {
                      _id: 1,
                      name: 1
                    }
                  }
                ],
                as: "userInfo"
              }
            },
            { $unwind: "$userInfo" }, // ❗ removes inactive users
            {
              $project: {
                user: "$userInfo._id",
                userName: "$userInfo.name",
                mealDay: 1
              }
            }
          ],
          as: "borderMeal"
        }
      },
      { $unwind: "$borderMeal" },
      {
        $lookup: {
          from: "mealdays",
          let: { mealDayId: "$borderMeal.mealDay" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$mealDayId"] },
                year: parseInt(year),
                month: parseInt(month)
              }
            },
            {
              $project: {
                date: 1,
                day: 1
              }
            }
          ],
          as: "mealDay"
        }
      },
      { $unwind: "$mealDay" },
      {
        $addFields: {
          itemTotal: {
            $multiply: [
              "$unitPrice",
              { $ifNull: ["$quantity", 1] }
            ]
          }
        }
      }
    ]);

    const pipeline = [

      { $match: matchShopping },

      // ============================
      // 🔥 BorderMeal + ACTIVE USER FILTER
      // ============================
      ...buildBaseLookupStages(),

      // 🔹 Optional user filter (still works)
      ...(user
        ? [{
          $match: {
            "borderMeal.user": new mongoose.Types.ObjectId(user)
          }
        }]
        : []),

      // ============================
      // 🔥 FACET
      // ============================
      {
        $facet: {

          summary: [
            {
              $group: {
                _id: null,
                totalExpense: { $sum: "$itemTotal" },
                totalTransactions: { $sum: 1 }
              }
            }
          ],

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
                categoryId: "$category._id",
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],

          userSummary: [
            {
              $group: {
                _id: "$borderMeal.user",
                name: { $first: "$borderMeal.userName" },
                total: { $sum: "$itemTotal" }
              }
            },
            {
              $project: {
                _id: 0,
                userId: "$_id",
                name: 1,
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],

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
                tagName: "$tag.name",
                tagId: "$tag._id",
                total: 1
              }
            },
            { $sort: { total: -1 } }
          ],

          // 🔥 PAGINATED RECENT
          recentData: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },

            {
              $lookup: {
                from: "productcategories",
                localField: "category",
                foreignField: "_id",
                as: "category"
              }
            },
            { $unwind: "$category" },

            {
              $project: {
                _id: 0,
                date: "$createdAt",
                product: "$productName",
                category: "$category.name",
                amount: "$itemTotal",
                quantity: "$productCount",
                user: "$borderMeal.userName" // ✅ no extra lookup needed
              }
            }
          ],

          recentCount: [
            { $count: "total" }
          ]
        }
      }
    ];

    const result = await ShoppingModel.aggregate(pipeline);

    // ============================
    // 🔹 Category OPTIONS (for the dropdown)
    // Always runs. Ignores the category & tag filters completely so
    // selecting a category never makes other categories disappear
    // from the dropdown. Respects only user + year/month.
    // ============================
    const categoryOptionsMatch = {};
    if (user) {
      categoryOptionsMatch["borderMeal.user"] = new mongoose.Types.ObjectId(user);
    }

    const categoryOptionsSummary = await ShoppingModel.aggregate([
      ...buildBaseLookupStages(),
      ...(Object.keys(categoryOptionsMatch).length ? [{ $match: categoryOptionsMatch }] : []),
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
          categoryId: "$category._id",
          name: "$category.name",
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    // ============================
    // 🔹 Tag OPTIONS (for the dropdown)
    // Always runs. Ignores the tag filter completely so selecting a tag
    // never makes other tags disappear from the dropdown. Respects the
    // user and/or category filters when present, so the list still
    // narrows correctly for those.
    // ============================
    const tagOptionsMatch = {};
    if (user) {
      tagOptionsMatch["borderMeal.user"] = new mongoose.Types.ObjectId(user);
    }
    if (category) {
      tagOptionsMatch.category = {
        $in: category.split(",").map(id => new mongoose.Types.ObjectId(id))
      };
    }

    const tagOptionsSummary = await ShoppingModel.aggregate([
      ...buildBaseLookupStages(),
      ...(Object.keys(tagOptionsMatch).length ? [{ $match: tagOptionsMatch }] : []),
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
          tagId: "$tag._id",
          tagName: "$tag.name",
          total: 1
        }
      },
      { $sort: { total: -1 } }
    ]);

    const data = result[0] || {};
    const totalRecent = data.recentCount?.[0]?.total || 0;

    res.json({
      success: true,
      data: {
        ...data,
        categoryOptionsSummary,
        tagOptionsSummary,
        recent: data.recentData || []
      },
      pagination: {
        total: totalRecent,
        page,
        limit,
        totalPages: Math.ceil(totalRecent / limit)
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to load expense summary"
    });
  }
};





