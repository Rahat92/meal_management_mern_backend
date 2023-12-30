const AppError = require("../uitls/AppError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendDuplicateFieldError = (error) => {
  return new AppError(`duplicate field: ${Object.keys(error.keyValue)}`, 400);
};

const sendCastError = () => {
  return new AppError("Invalid Customer Id, Please give the valid id", 400);
};
const sendValidationError = (error) => {
  return new AppError(`${error.message}`, 400);
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    return res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;
    if (error.code === 11000) error = sendDuplicateFieldError(error);
    if (error.path === "_id") error = sendCastError(error);
    console.log(error);
    if (error?._message?.includes("validation"))
      error = sendValidationError(error);
    sendErrorProd(error, res);
  }
};
