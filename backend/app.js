const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { port, uri } = require("./config");

const app = express();

// CORS
// app.use(cors())
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Database connection, mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = uri;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB, {
    dbName: "blogs",
  });
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Route setup
const indexRouter = require("./routes/index");
const userRouter = require("./routes/userRoute");
const blogRouter = require("./routes/blogRoute");

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/blog", blogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
