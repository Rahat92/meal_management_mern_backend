const catchAsync = require("../utils/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const YearMonth = require("../models/yearMonthModel");
const Meal = require("../models/mealCountModel");
exports.createYearMonth = catchAsync(async (req, res) => {
  const yearMonth = await YearMonth.create({...req.body, manager: req.user._id});
  res.status(201).json({
    status: "Success",
    yearMonth,
  });
});

exports.getAllYearMonth = catchAsync(async (req, res) => {
  console.log('Hello world')
  let yearMonth = YearMonth.find({manager: req.user.role === 'admin'?req.user._id:req.user.manager._id});
  yearMonth = new ApiFeatures(yearMonth, req.query).sort();
  yearMonth = await yearMonth.query;
  res.status(200).json({
    status: "Success",
    yearMonth,
  });
});
exports.getYearMonth = catchAsync(async (req, res) => {
  const yearMonth = await YearMonth.findById(req.params.id);
  res.status(200).json({
    status: "Success",
    yearMonth,
  });
});

exports.deleteYearMonth = catchAsync(async (req, res) => {
  const {year, month} = req.body;
  console.log(year,month)
  await YearMonth.findByIdAndDelete(req.params.id);
  await Meal.deleteMany({
    month: Number(month),
    year: Number(year),
    manager: req.user.role === 'admin' ? req.user._id : req.user.manager._id
  })
  res.status(204).json({
    status: "Success",
    message: 'Successfully delete a month.',
  });
});
