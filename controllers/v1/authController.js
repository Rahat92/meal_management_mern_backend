const client = require("twilio")(
  "ACe0ab0de1faa22a08fe1fdd4f77e09337",
  "a84563bd40f8b30198921f37b742c9f1"
);
const Meal = require("../../models/mealCountModel");
const User = require("../../models/userModel");
const AppError = require("../../utils/AppError");
const catchAsyncError = require("../../utils/catchAsyncError");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { promisify } = require("util");
const tokenProducer = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_TOKEN,
  });
};
const resAndSendToken = (user, res, statusCode) => {
  const token = tokenProducer(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token", token, cookieOptions);
  if (process.env.NODE_ENV === "PRODUCTION") cookieOptions.secure = true;
  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.protect = catchAsyncError(async (req, res, next) => {
  // const { token } = req.cookies;
  let token;
  if (req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    // return next(
    //   new AppError(`You are now not logged in, Please log in first`, 400)
    // );
    return res.status(401).json({
      status: "fail",
      message: "You are now not logged in, Please log in first",
    });
  }
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const currentUser = await User.findById(decoded.id).populate('manager');
  if (!currentUser) {
    // return next(
    //   new AppError(`The user belonging this token is no longer exist`, 400)
    // );
    return res.status(401).json({
      status: "fail",
      message: "The user belonging this token is no longer exist",
    });
  }
  if (currentUser.isPasswordChanged(decoded.iat)) {
    // return next(
    //   new AppError(
    //     `The user changed password after issuing this  token, Please log in again`,
    //     400
    //   )
    // );
    return res.status(401).json({
      status: "fail",
      message:
        "The user changed password after issuing this  token, Please log in again",
    });
  }
  req.user = currentUser;
  next();
});

exports.restrictedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      // return next(
      //   new AppError(`You are not allowed to perform this action`, 400)
      // );
      return res.status(401).json({
        status: "fail",
        message: "You are not allowed to perform this action",
      });
    }
    next();
  };
};

exports.signUp = catchAsyncError(async (req, res, next) => {
  const { name, email, password, passwordConfirm, manager, morningMealCount } = req.body;
  console.log(password, passwordConfirm)
  if (password !== passwordConfirm) {
    // return next(
    //   new AppError(`Password and Confirm Password doesn't match`, 400)
    // );
    return res.status(401).json({
      status: "fail",
      message: "Password and Confirm Password doesn't match",
    });
  }
  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    manager,
    morningMealCount
  });
  const currentMonthMeals = await Meal.find({ month: 0, year: 2025 });
  currentMonthMeals.map(async (el, i) => {
    const borders = [...el.border, user];
    const breakfasts = [...el.breakfast, [0, "on", "admin"]];
    const launchs = [...el.launch, [1, "on", "admin"]];
    const dinners = [...el.dinner, [1, "on", "admin"]];
    const shops = [...el.shop, 0];
    const extraShops = [...el.extraShop, 0];
    const moneys = [...el.money, 0];
    await Meal.findByIdAndUpdate(el._id, {
      border: borders,
      breakfast: breakfasts,
      launch: launchs,
      dinner: dinners,
      shop: shops,
      money: moneys,
      extraShop: extraShops
    });
  });
  resAndSendToken(user, res, 201);
});

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(`No user found with this email`, 400));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;
    // send email

    res.status(200).json({
      status: "success",
      message: `Reset token sent to email`,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError(`Something went wrong, try again later`, 400));
  }
});

exports.logIn = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(`Please Provide Email and Password`, 400));
  const user = await User.findOne({ email }).select("+password").populate('manager');
  if (!user || !(await user.isPasswordMatched(password)))
    return next(new AppError(`Invalid email or password!`, 400));
  resAndSendToken(user, res, 200);
});
exports.getBorders = catchAsyncError(async (req, res) => {
  const borders = await User.find();
  res.status(200).json({
    status: "Success",
    borders,
  });
});

exports.getBorder = catchAsyncError(async (req, res) => {
  const border = await User.findById(req.params.id).populate('manager');
  res.status(200).json({
    status: "Success",
    border,
  });
});
exports.logOut = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged Out",
  });
});

exports.sendMessage = catchAsyncError(async (req, res) => {
  const sendSms = async (body) => {
    let smsOption = {
      from: "+17178379376",
      to: "+8801518394910",
      body,
    };
    try {
      const message = await client.messages.create(smsOption);
    } catch (error) {
      console.error(error);
    }
  };
  sendSms(`Your Current Balance is, ${req.body.restBalance}`);
});
