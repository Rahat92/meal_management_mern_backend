const User = require("../../models/userModel");
const catchAsyncError = require("../../utils/catchAsyncError");

exports.get_all_managers = catchAsyncError(async (req, res, next) => {
    const managers = await User.find({ role: "admin" }).select("-password -passwordConfirm -__v -createdAt -updatedAt");
    res.status(200).json({
        status: "success",
        data: {
            managers
        }
    });
})

exports.get_all_users = catchAsyncError(async (req, res, next) => {
    const managerId = req.query.managerId;
    console.log('haha', managerId)
    const page = req.query.page || 1;
    const limit = req.query.limit || 2;
    const offset = parseInt(page - 1) * parseInt(limit);
    const users = await User.find({ manager: managerId }).select("-password -passwordConfirm -__v -createdAt -updatedAt").skip(offset).limit(parseInt(limit));
    const totalUsers = await User.countDocuments({ manager: managerId });
    const totalPages = Math.ceil(totalUsers / limit);
    res.status(200).json({
        status: "success",
        data: {
            users,
            totalUsers,
            totalPages
        }
    });
})