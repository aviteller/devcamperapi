const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  let message = err.message || "";
  let code = err.statusCode || 500;

  //log to console
  console.log("err:", err.stack);

  error.message = err.message;
  //mongoose bad objectud
  switch (error.name) {
    case "CastError":
      message = `Resource not found with id of ${err.value}`;
      code = 404;
      break;
    case "ValidationError":
      message = Object.values(err.errors).map(val => val.message);
      code = 400;
      break;

    default:
      break;
  }

  switch (err.code) {
    case 11000:
      message = "Duplicate field value entered";
      code = 400;
      break;

    default:
      break;
  }

  error = new ErrorResponse(message, code);

  res.status(error.statusCode || code).json({
    success: false,
    error: error.message || "Server Error"
  });
};

module.exports = errorHandler;
