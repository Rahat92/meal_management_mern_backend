const User = require("../../models/userModel");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.get_all_managers = catchAsyncError(async(req,res, next) => {
    console.log("Fetching all managers...");
    const managers = await User.find({ role: "admin" }).select("-password -passwordConfirm -__v -createdAt -updatedAt");
    res.status(200).json({
        status: "success",
        data: {
            managers
        }
    });
})