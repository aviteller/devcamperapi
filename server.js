const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// const logger = require('./middleware/logger')
const fileupload = require("express-fileupload");
const morgan = require("morgan");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");

// route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

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

//set static folder maybe for front end stuff
app.use(express.static(path.join(__dirname, "public")));

//mount router
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
