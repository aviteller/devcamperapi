const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// const logger = require('./middleware/logger')
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");

// load env vars
dotenv.config({ path: "./config/config.env" });

// connect to db
connectDB();

const app = express();
//body parser
app.use(express.json());
// Dev Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// file upploading
app.use(fileupload());
//cookie middleware
app.use(cookieParser());

//set static folder maybe for front end stuff
app.use(express.static(path.join(__dirname, "public")));

//mount router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  //close server & exit proccess
  server.close(() => process.exit(1));
});
