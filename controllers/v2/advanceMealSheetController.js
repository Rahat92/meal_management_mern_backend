const mongoose = require('mongoose')
const MealMonthModel = require("../../models/v2/MealMonthModel");
const User = require("../../models/userModel");
const BorderMealModel = require("../../models/v2/borderMealModel");
const MealDayModel = require('../../models/v2/mealDayModel');

exports.createMonthlySheet = async (req, res) => {
    try {
        const { year, month } = req.body;

        const mealManager = req.user._id;

        const existing = await MealMonthModel.findOne({ mealManager, year, month });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Monthly sheet already exists"
            });
        }

        const mealMonth = await MealMonthModel.create({
            mealManager,
            year,
            month
        });

        const daysInMonth = new Date(year, month, 0).getDate();

        const users = await User.find({
            mealManager,
            active: true,
            role: "user"
        }).select("_id");

        for (let day = 1; day <= daysInMonth; day++) {

            const dateObj = new Date(year, month, day);

            const mealDay = await MealDayModel.create({
                mealMonth: mealMonth._id,
                date: 1,
                day,
                month,
                year
            });

            const borderMeals = users.map(user => ({
                mealDay: mealDay._id,
                user: user._id
            }));

            await BorderMealModel.insertMany(borderMeals);
        }

        res.status(201).json({
            success: true,
            message: "Monthly sheet created successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// exports.getAdvanceMonthlySheet = async (req, res) => {
//     const mealMonthId = req.params.id;

//     const sheet = await MealMonthModel.findById(mealMonthId)
//         .populate('mealManager') // manager info
//         .populate({
//             path: 'mealDays',
//             populate: {
//                 path: 'borderMeals',
//                 populate: {
//                     path: 'user',
//                     select: 'name email role' // optional
//                 }
//             }
//         });

//     res.status(200).json({
//         success: true,
//         sheet
//     });
// };

exports.getRowMonthSheet = async (req, res) => {
    try {
        const monthId = req.params.monthId;
        const monthRowSheet = await MealMonthModel.find({ mealMonth: monthId })
        res.status(200).json({
            success: true,
            monthRowSheet
        })
    } catch (err) {
        console.log(err)
    }
}

exports.getAdvanceMonthlySheet = async (req, res) => {
    try {
        const monthId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 3;
        const skip = (page - 1) * limit;

        const monthObjectId = new mongoose.Types.ObjectId(monthId);

        // Step 1: Get all MealDay IDs for this month
        const mealDays = await MealDayModel.find({ mealMonth: monthObjectId }).select("_id day").lean();
        const today = new Date().getDate();
        const currentDayIds = mealDays
            .filter(d => {
                return d.day <= today;
            })
            .map(d => d._id);
        const dayIds = mealDays.map(d => d._id);

        if (dayIds.length === 0) {
            return res.status(200).json({
                success: true,
                totalUsers: 0,
                totalPages: 0,
                currentPage: page,
                data: []
            });
        }

        // 🔥 Step 2: Aggregate BorderMeals
        const pipeline = [
            {
                $match: {
                    mealDay: { $in: dayIds }
                }
            },
            // Group meals by user
            {
                $lookup: {
                    from: "mealdays",
                    localField: "mealDay",
                    foreignField: "_id",
                    as: "mealDayInfo"
                }
            },
            { $unwind: "$mealDayInfo" },
            {
                $group: {
                    _id: "$user",
                    meals: {
                        $push: {
                            id: "$_id",
                            mealDay: "$mealDay",
                            day: "$mealDayInfo.day",
                            month: "$mealDayInfo.month",
                            year: "$mealDayInfo.year",
                            breakfast: "$breakfast.meal",
                            lunch: "$lunch.meal",
                            dinner: "$dinner.meal",
                            deposit: "$money",
                            mealExpense: "$shop"
                        }
                    },
                    totalBreakfast: {
                        $sum: {
                            $cond: [
                                { $in: ["$mealDay", currentDayIds] },
                                "$breakfast.meal",
                                0
                            ]
                        }
                    },
                    totalDeposit: {
                        $sum: {
                            $cond: [
                                { $in: ["$mealDay", currentDayIds] },
                                "$money",
                                0
                            ]
                        }
                    },
                    totalMealExpense: {
                        $sum: {
                            $cond: [
                                { $in: ["$mealDay", currentDayIds] },
                                "$shop",
                                0
                            ]
                        }
                    },
                    totalLunch: {
                        $sum: {
                            $cond: [
                                { $in: ["$mealDay", currentDayIds] },
                                "$lunch.meal",
                                0
                            ]
                        }
                    },
                    totalDinner: {
                        $sum: {
                            $cond: [
                                { $in: ["$mealDay", currentDayIds] },
                                "$dinner.meal",
                                0
                            ]
                        }
                    },
                }
            },

            // Count before pagination
            {
                $facet: {
                    metadata: [{ $count: "totalUsers" }],
                    users: [
                        { $sort: { _id: 1 } },
                        { $skip: skip },
                        { $limit: limit },

                        // Join user info
                        {
                            $lookup: {
                                from: "users",
                                localField: "_id",
                                foreignField: "_id",
                                as: "user"
                            }
                        },

                        { $unwind: "$user" },
                        // {
                        //     $lookup: {
                        //         from:"MealDay",
                        //         localField:"mealDay",
                        //         foreignField: "_id",
                        //         as:"day"
                        //     }
                        // },
                        // {$unwind: "$day"},

                        {
                            $project: {
                                _id: 0,
                                // date: "$day.date",
                                userId: "$_id",
                                name: "$user.name",
                                email: "$user.email",
                                meals: 1,
                                totalBreakfast: 1,
                                totalLunch: 1,
                                totalDinner: 1,
                                totalMeals: {
                                    $add: [
                                        "$totalBreakfast",
                                        "$totalLunch",
                                        "$totalDinner"
                                    ]
                                },
                                totalDeposit: 1,
                                totalMealExpense: 1
                            }
                        }
                    ]
                }
            }
        ];

        const result = await BorderMealModel.aggregate(pipeline);

        const totalUsers = result[0].metadata[0]?.totalUsers || 0;
        const users = result[0].users;

        res.status(200).json({
            success: true,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page,
            data: users
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load monthly sheet"
        });
    }
}

exports.getUserMonthlySheet = async (req, res) => {
    try {
        const { year, month } = req.body;
        const userId = new mongoose.Types.ObjectId(req.params.id);

        // 1️⃣ Find meal month
        const monthDoc = await MealMonthModel.findOne({
            year: parseInt(year),
            month: parseInt(month)
        }).lean();

        if (!monthDoc) {
            return res.status(404).json({
                success: false,
                message: "Month not found"
            });
        }

        // 2️⃣ Today cutoff (important)
        const today = new Date();
        const isCurrentMonth =
            today.getFullYear() === parseInt(year) &&
            today.getMonth() + 1 === parseInt(month);

        const lastDay = isCurrentMonth
            ? today.getDate()
            : new Date(year, month, 0).getDate();
        // 3️⃣ Get MealDay IDs till today
        // const mealDays = await MealDayModel.find({
        //     mealMonth: monthDoc._id,
        //     day: { $lte: lastDay }
        const mealDays = await MealDayModel.find({
            mealMonth: monthDoc._id
        }).select("_id day date").lean();

        const dayIds = mealDays.map(d => d._id);

        if (!dayIds.length) {
            return res.json({ success: true, data: {} });
        }

        // 4️⃣ Aggregation
        const result = await BorderMealModel.aggregate([

            {
                $match: {
                    user: userId,
                    mealDay: { $in: dayIds }
                }
            },

            // 🔹 Lookup shopping
            {
                $lookup: {
                    from: "shoppings",
                    localField: "_id",
                    foreignField: "borderMeal",
                    as: "shopping"
                }
            },

            { $unwind: { path: "$shopping", preserveNullAndEmptyArrays: true } },

            // 🔹 Populate category
            {
                $lookup: {
                    from: "productcategories",
                    localField: "shopping.category",
                    foreignField: "_id",
                    as: "shopping.category"
                }
            },

            {
                $unwind: {
                    path: "$shopping.category",
                    preserveNullAndEmptyArrays: true
                }
            },

            // 🔹 Populate tags
            {
                $lookup: {
                    from: "productstags",
                    localField: "shopping.tags",
                    foreignField: "_id",
                    as: "shopping.tags"
                }
            },

            // 🔹 Regroup shopping per BorderMeal
            {
                $group: {
                    _id: "$_id",
                    user: { $first: "$user" },
                    mealDay: { $first: "$mealDay" },
                    breakfast: { $first: "$breakfast" },
                    lunch: { $first: "$lunch" },
                    dinner: { $first: "$dinner" },
                    money: { $first: "$money" },
                    shop: { $first: "$shop" },

                    shopping: {
                        $push: {
                            _id: "$shopping._id",
                            productName: "$shopping.productName",
                            productCount: "$shopping.productCount",
                            unitPrice: "$shopping.unitPrice",
                            type: "$shopping.type",
                            category: "$shopping.category",
                            tags: "$shopping.tags"
                        }
                    }
                }
            },

            // 🔹 Final user grouping
            {
                $group: {
                    _id: "$user",

                    days: {
                        $push: {
                            mealDay: "$mealDay",
                            breakfast: "$breakfast.meal",
                            lunch: "$lunch.meal",
                            dinner: "$dinner.meal",
                            deposit: "$money",
                            mealExpense: "$shop",
                            shopping: "$shopping"
                        }
                    },

                    totalBreakfast: { $sum: "$breakfast.meal" },
                    totalLunch: { $sum: "$lunch.meal" },
                    totalDinner: { $sum: "$dinner.meal" },

                    totalDeposit: { $sum: "$money" },
                    totalMealExpense: { $sum: "$shop" }
                }
            },

            {
                $project: {
                    _id: 0,
                    days: 1,
                    totalMeals: {
                        $add: ["$totalBreakfast", "$totalLunch", "$totalDinner"]
                    },
                    totalDeposit: 1,
                    totalMealExpense: 1,
                    balance: {
                        $subtract: ["$totalDeposit", "$totalMealExpense"]
                    }
                }
            }

        ]);

        res.json({
            success: true,
            data: result[0] || {}
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load user monthly sheet"
        });
    }
};


exports.getShoppingReport = async (req, res) => {
    try {
        const { year, month } = req.query;
        const userId = new mongoose.Types.ObjectId(req.params.userId);

        const result = await ShoppingModel.aggregate([

            // 1️⃣ Join BorderMeal
            {
                $lookup: {
                    from: "bordermeals",
                    localField: "borderMeal",
                    foreignField: "_id",
                    as: "borderMeal"
                }
            },
            { $unwind: "$borderMeal" },

            // 2️⃣ Filter by user
            {
                $match: {
                    "borderMeal.user": userId
                }
            },

            // 3️⃣ Join MealDay
            {
                $lookup: {
                    from: "mealdays",
                    localField: "borderMeal.mealDay",
                    foreignField: "_id",
                    as: "mealDay"
                }
            },
            { $unwind: "$mealDay" },

            // 4️⃣ Filter by month + year
            {
                $match: {
                    "mealDay.year": parseInt(year),
                    "mealDay.month": parseInt(month)
                }
            },

            // 5️⃣ Join category
            {
                $lookup: {
                    from: "productcategories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

            // 6️⃣ Join tags
            {
                $lookup: {
                    from: "productstags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags"
                }
            },

            // 7️⃣ Join user
            {
                $lookup: {
                    from: "users",
                    localField: "borderMeal.user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },

            // 8️⃣ Final projection (flat response)
            {
                $project: {
                    _id: 0,
                    month: "$mealDay.month",
                    year: "$mealDay.year",
                    mealDate: {
                        $dateToString: {
                            format: "%d %B %Y",
                            date: "$mealDay.date"
                        }
                    },
                    productName: 1,
                    productCount: 1,
                    unitPrice: 1,

                    category: {
                        categoryId: "$category._id",
                        categoryName: "$category.name"
                    },

                    tags: {
                        $map: {
                            input: "$tags",
                            as: "tag",
                            in: {
                                tagId: "$$tag._id",
                                tagName: "$$tag.name"
                            }
                        }
                    },

                    user: {
                        userId: "$user._id",
                        userName: "$user.name"
                    },

                    commentCreatedAt: "$createdAt"
                }
            },

            { $sort: { commentCreatedAt: -1 } }

        ]);

        res.json({
            success: true,
            total: result.length,
            data: result
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load shopping report"
        });
    }
};