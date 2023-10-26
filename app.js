const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const UserSchema = require('./models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Set up mongoose connection
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);


const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.post("/sign-up", async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
  try {
    const user = new UserSchema({
      first_name : req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.username,
      password: hashedPassword
    });
    const result = await user.save();
    res.redirect("/");
  } catch(err) {
    return next(err);
  };
});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
