const Meal = require("../models/mealCountModel");
const User = require("../models/userModel");
const YearMonthModel = require("../models/yearMonthModel");
const AppError = require("../utils/AppError");
const catchAsyncError = require("../utils/catchAsyncError");

exports.createMeal = catchAsyncError(async (req, res) => {
  const users = await User.find();
  const borders = users.filter((user) => user.role !== "superadmin");
  const body = req.body.map((el) => {
    return {
      ...el,
      border: borders,
      money: Array(borders.length).fill(0),
      shop: Array(borders.length).fill(0),
      extraShop: Array(borders.length).fill(0),
      breakfast: Array(borders.length).fill([0.5, "on", "admin"]),
      launch: Array(borders.length).fill([1, "on", "admin"]),
      dinner: Array(borders.length).fill([1, "on", "admin"]),
    };
  });
  const yearMonth = await YearMonthModel.create({
    year: req.body[0].year,
    month: req.body[0].month,
  });
  const meal = await Meal.create(body);
  res.status(201).json({
    status: "Success",
    meal,
  });
});

exports.getMonthMeals = catchAsyncError(async (req, res) => {
  const monthlyMeals = await Meal.find({
    month: req.params.month,
    year: req.params.year,
  });
  res.status(200).json({
    status: "Success",
    month: req.params.month,
    year: req.params.year,
    monthlyMeals,
  });
});
exports.updateMeal = catchAsyncError(async (req, res) => {
  const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json({
    status: "Success",
    meal,
  });
});

exports.updatePersonFullMeal = catchAsyncError(async (req, res, next) => {
  console.log(req.body.requestTime);
  const { requestTime } = req.body;
  if (
    req.body.userIndex !== req.body.personIndex &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    // return next(
    //   new AppError("You are not allowed to perform this action!", 400)
    // );
    return res.status(400).json({
      status: "Fail",
      message: "You are not allowed to perform this action!",
    });
  }

  if (
    new Date() >
      new Date(req.body.year, req.body.month, req.body.day, 6, 0, 0) &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    // return next(new AppError("Full Meal update time is over", 400));
    return res.status(400).json({
      status: "Fail",
      message: "Full Meal update time is over",
    });
  }
  if (
    req.user.role === "admin" &&
    new Date() > new Date(req.body.year, req.body.month, req.body.day, 24, 0, 0)
  ) {
    // return next(
    //   new AppError("Admin is not allowed to update previous day meal", 400)
    // );
    return res.status(400).json({
      status: "Fail",
      message: "Admin is not allowed to update previous day meal",
    });
  }
  const existingMeal = await Meal.findById(req.body.id);
  const breakfasts = existingMeal.breakfast;
  const launchs = existingMeal.launch;
  const dinners = existingMeal.dinner;
  const copyBreakfasts = [...breakfasts];
  const copyLaunchs = [...launchs];
  const copyDinners = [...dinners];
  copyBreakfasts[req.body.personIndex] = req.body.personBreakfast;
  copyLaunchs[req.body.personIndex] = req.body.personLaunch;
  copyDinners[req.body.personIndex] = req.body.personDinner;
  existingMeal.breakfast = copyBreakfasts;
  existingMeal.launch = copyLaunchs;
  existingMeal.dinner = copyDinners;
  await existingMeal.save();

  res.status(200).json({
    status: "Success",
    existingMeal,
  });
});

exports.setMyMealStatus = catchAsyncError(async (req, res, next) => {
  if (
    req.body.mealIndex !== req.body.userIndex &&
    req.user.role !== "admin" &&
    req.user.role !== "superadmin" &&
    req.user.role !== "admin"
  ) {
    // return next(new AppError("You only can update your meal", 400));
    return res.status(400).json({
      status: "Fail",
      message: "You only can update your meal",
    });
  }
  // if (
  //   req.body.mealName === "breakfast" &&
  //   // (new Date() > new Date(req.body.year * 1, month, req.body.day * 1, 6))&&req.user.role!=='admin'
  //   new Date() >
  //     new Date(req.body.year * 1, req.body.month, req.body.day * 1, 6) &&
  //   req.user.role !== "superadmin" &&
  //   req.user.role !== "admin"
  // ) {
  //   // return next(new AppError("Breakfast meal request time is over", 400));
  //   return res.status(400).json({
  //     status: "Fail",
  //     message: "Breakfast meal request time is over",
  //   });
  // }
  // if (
  //   req.body.mealName === "launch" &&
  //   // (new Date() > new Date(req.body.year * 1, month, req.body.day * 1, 10))&&req.user.role!=='admin'
  //   new Date() >
  //     new Date(req.body.year * 1, req.body.month, req.body.day * 1, 10) &&
  //   req.user.role !== "superadmin" &&
  //   req.user.role !== "admin"
  // ) {
  //   // return next(new AppError("Launch meal request time is over", 400));
  //   return res.status(400).json({
  //     status: "Fail",
  //     message: "Launch meal request time is over",
  //   });
  // }
  // console.log(req.body.mealName);
  // console.log(new Date().toDateString());
  // console.log(
  //   new Date() >
  //     new Date(req.body.year * 1, req.body.month, req.body.day * 1, 18)
  // );
  // if (
  //   req.body.mealName === "dinner" &&
  //   // (new Date() > new Date(req.body.year * 1, month, req.body.day * 1, 10))&&req.user.role!=='admin'
  //   new Date() >
  //     new Date(req.body.year * 1, req.body.month, req.body.day * 1, 10) &&
  //   req.user.role !== "superadmin" &&
  //   req.user.role !== "admin"
  // ) {
  //   // return next(new AppError("Dinner meal request time is over", 400));
  //   return res.status(400).json({
  //     status: "Fail",
  //     message: "Dinner meal request time is over",
  //   });
  // }

  // if (
  //   (req.body.mealName === "breakfast" ||
  //     req.body.mealName === "launch" ||
  //     req.body.mealName === "dinner") &&
  //   req.user.role === "admin" &&
  //   new Date() >
  //     new Date(req.body.year * 1, req.body.month, req.body.day * 1, 24)
  // ) {
  //   // return next(new AppError("Admin can not update previous days meal", 400));
  //   return res.status(400).json({
  //     status: "Fail",
  //     message: "Admin can not update previous days meal",
  //   });
  // }
  const meal = await Meal.findById(req.params.id);
  const existingMeal = [...meal[req.body.mealName]];
  if (
    existingMeal[req.body.mealIndex][2] === "user" &&
    req.user.role === "admin"
  ) {
    // return next(
    //   new AppError(
    //     "This meal is setted by user.Therefore Admin can not update this meal.",
    //     400
    //   )
    // );
    return res.status(400).json({
      status: "Fail",
      message:
        "This meal is setted by user.Therefore Admin can not update this meal.",
    });
  }
  const personMeal = (existingMeal[req.body.mealIndex] =
    req.body[req.body.mealName][req.body.mealIndex]);
  personMeal[2] =
    personMeal[0] === 0 && personMeal[1] === "on" ? "admin" : req.user.role;
  meal[req.body.mealName] = existingMeal;
  await meal.save();
  res.status(200).json({
    status: "Success",
    meal,
  });
});
exports.updateMoney = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    // return next(
    //   new AppError(
    //     "You have no permisson to update your balance, only admin can do this",
    //     400
    //   )
    // );
    return res.status(400).json({
      status: "Fail",
      message:
        "You have no permisson to update your balance, only admin can do this",
    });
  }
  const meal = await Meal.findById(req.body.id);
  const copyBorderMoneyArr = [...meal.money];
  copyBorderMoneyArr[req.body.borderIndex] = req.body.money;
  meal.money = copyBorderMoneyArr;
  await meal.save();
  res.status(200).json({
    status: "Success",
    meal,
  });
});
exports.updateShopMoney = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    // return next(
    //   new AppError(
    //     "You have no permisson to update your balance, only admin can do this",
    //     400
    //   )
    // );
    return res.status(400).json({
      status: "Fail",
      message:
        "You have no permisson to update your balance, only admin can do this",
    });
  }
  const meal = await Meal.findById(req.body.id);
  console.log(meal);

  const copyBorderShopMoneyArr = [...meal.shop];
  copyBorderShopMoneyArr[req.body.borderIndex] = req.body.shop;
  meal.shop = copyBorderShopMoneyArr;
  await meal.save();
  res.status(200).json({
    status: "Success",
    meal,
  });
});
exports.updateExtraShopMoney = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    // return next(
    //   new AppError(
    //     "You have no permisson to update your balance, only admin can do this",
    //     400
    //   )
    // );
    return res.status(400).json({
      status: "Fail",
      message:
        "You have no permisson to update your Extra Shop, only admin can do this",
    });
  }
  const meal = await Meal.findById(req.body.id);
  console.log(meal);

  const copyBorderExtraShopMoneyArr = [...meal.extraShop];
  copyBorderExtraShopMoneyArr[req.body.borderIndex] = req.body.extraShop;
  meal.extraShop = copyBorderExtraShopMoneyArr;
  await meal.save();
  res.status(200).json({
    status: "Success",
    meal,
  });
});

exports.getBorderMonthlyStats = catchAsyncError(async (req, res) => {
  const { month, year, day } = req.params;
  const currentMonth = new Date().getMonth();
  console.log("currentMOnth", currentMonth,month);
  const monthlyMeals = await Meal.aggregate([
    {
      $match: {
        year: year * 1,
        day: {
          $gte: 1,
          $lte: currentMonth!==month?31: day * 1,
        },
        // month: month * 1,
      },
    },
    {
      $project: {
        month: 1,
        year: 1,
        x: {
          $zip: {
            inputs: [
              "$border",
              "$breakfast",
              "$launch",
              "$dinner",
              "$money",
              "$shop",
              "$extraShop",
            ],
          },
        },
      },
    },
    {
      $unwind: "$x",
    },
    {
      $project: {
        _id: false,
        border: { $arrayElemAt: ["$x", 0] },
        breakfast: { $arrayElemAt: ["$x", 1] },
        launch: { $arrayElemAt: ["$x", 2] },
        dinner: { $arrayElemAt: ["$x", 3] },
        money: { $arrayElemAt: ["$x", 4] },
        shop: { $arrayElemAt: ["$x", 5] },
        extraShop: { $arrayElemAt: ["$x", 6] },
        month: 1,
        year: 1,
      },
    },
    {
      $group: {
        _id: {
          month: "$month",
          year: "$year",
        },
        border: { $push: "$border" },
        breakfast: { $push: "$breakfast" },
        launch: { $push: "$launch" },
        dinner: { $push: "$dinner" },
        money: { $push: "$money" },
        shop: { $push: "$shop" },
        extraShop: { $push: "$extraShop" },
      },
    },
  ]);
  res.status(200).json({
    status: "Success",
    monthlyMeals,
  });
});
exports.dailyMealCalc = catchAsyncError(async (req, res) => {
  const monthlyMeals = await Meal.aggregate([
    // {
    //   $match: {
    //     month: 10,
    //   },
    // },
    {
      $project: {
        month: 1,
        x: {
          $zip: {
            inputs: ["$border", "$breakfast", "$launch", "$dinner"],
          },
        },
      },
    },
    {
      $unwind: "$x",
    },
    {
      $project: {
        _id: false,
        border: { $arrayElemAt: ["$x", 0] },
        breakfast: { $arrayElemAt: ["$x", 1] },
        launch: { $arrayElemAt: ["$x", 2] },
        dinner: { $arrayElemAt: ["$x", 3] },
        month: 1,
      },
    },
    {
      $group: {
        _id: "$month",
        border: { $push: "$border" },
        breakfast: { $push: "$breakfast" },
        launch: { $push: "$launch" },
        dinner: { $push: "$dinner" },
      },
    },
  ]);
  res.status(200).json({
    status: "Success",
    monthlyMeals,
  });
});
