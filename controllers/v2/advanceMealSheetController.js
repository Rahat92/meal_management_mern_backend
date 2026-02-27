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

exports.getAdvanceMonthlySheet = async (req, res) => {
    try {
        const monthId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const skip = (page - 1) * limit;

        const monthObjectId = new mongoose.Types.ObjectId(monthId);

        // 🔹 Step 1: Get all MealDay IDs for this month
        const mealDays = await MealDayModel.find({ mealMonth: monthObjectId }).select("_id day").lean();
        const today = new Date().getDate();
        const currentDayIds = mealDays
            .filter(d => {
                return d.day <= today;
            })
            .map(d => d._id);
        console.log(currentDayIds)
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
                $group: {
                    _id: "$user",
                    meals: {
                        $push: {
                            mealDay: "$mealDay",
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
        const today = new Date();
        const isCurrentMonth =
            today.getFullYear() === year &&
            today.getMonth() + 1 === month;

        const tillDay = isCurrentMonth ? today.getDate() : 31;

        // 1️⃣ Find Month
        const monthDoc = await MealMonthModel.findOne({
            year: parseInt(year),
            month: parseInt(month)
        });

        if (!monthDoc) {
            return res.status(404).json({
                success: false,
                message: "Month not found"
            });
        }

        // 2️⃣ Get all MealDays of that month
        const mealDays = await MealDayModel.find({
            mealMonth: monthDoc._id,
            day: { $lte: tillDay }
        }).select("_id day date").lean();

        const dayIds = mealDays.map(d => d._id);
        if (dayIds.length === 0) {
            return res.json({ success: true, data: [] });
        }
        console.log(dayIds);

        // 3️⃣ Aggregation
        const pipeline = [
            {
                $match: {
                    user: userId,
                    mealDay: { $in: dayIds }
                }
            },

            // 🔹 Join meal day info
            {
                $lookup: {
                    from: "mealdays",
                    localField: "mealDay",
                    foreignField: "_id",
                    as: "day"
                }
            },
            { $unwind: "$day" },

            // 🔹 Join shopping details
            {
                $lookup: {
                    from: "shoppings",
                    localField: "_id",
                    foreignField: "borderMeal",
                    as: "shopping"
                }
            },

            // 🔹 Group everything for summary
            {
                $group: {
                    _id: null,

                    days: {
                        $push: {
                            day: "$day.day",
                            date: "$day.date",
                            breakfast: "$breakfast.meal",
                            lunch: "$lunch.meal",
                            dinner: "$dinner.meal",
                            deposit: "$money",
                            expense: "$shop",
                            shopping: {
                                $map: {
                                    input: "$shopping",
                                    as: "s",
                                    in: {
                                        item: "$$s.productName",
                                        price: "$$s.unitPrice",
                                        category: "$$s.category",
                                        type: "$$s.type"
                                    }
                                }
                            }
                        }
                    },

                    totalBreakfast: { $sum: "$breakfast.meal" },
                    totalLunch: { $sum: "$lunch.meal" },
                    totalDinner: { $sum: "$dinner.meal" },
                    totalDeposit: { $sum: "$money" },
                    totalExpense: { $sum: "$shop" }
                }
            },

            // 🔹 Final shape
            {
                $project: {
                    _id: 0,
                    days: 1,
                    totalMeals: {
                        $add: [
                            "$totalBreakfast",
                            "$totalLunch",
                            "$totalDinner"
                        ]
                    },
                    totalDeposit: 1,
                    totalExpense: 1
                }
            }
        ];
        const result = await BorderMealModel.aggregate(pipeline);

        res.status(200).json({
            success: true,
            data: result[0] || {
                days: [],
                totalMeals: 0,
                totalDeposit: 0,
                totalExpense: 0
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to load user monthly sheet"
        });
    }
};