const catchAsync = require("../utils/catchAsyncError");
const ApiFeatures = require("../utils/apiFeatures");
const YearMonth = require("../models/yearMonthModel");
exports.createYearMonth = catchAsync(async (req, res) => {
  const yearMonth = await YearMonth.create(req.body);
  res.status(201).json({
    status: "Success",
    yearMonth,
  });
});

exports.getAllYearMonth = catchAsync(async (req, res) => {
  let yearMonth = YearMonth.find();
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
  const yearMonth = await YearMonth.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "Success",
    yearMonth,
  });
});
