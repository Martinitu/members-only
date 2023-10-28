const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const session = require('express-session');


exports.index = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    const [
      numUsers,
      numMessgaes,
      
    ] = await Promise.all([
      User.countDocuments({}).exec(),
      Message.countDocuments({}).exec(),

    ]);
  
    res.render("index", {
      title: "Members Only Home",
      user_count: numUsers,
      message_count: numMessgaes,

    });
  });
  exports.sign_up_get = asyncHandler(async (req, res, next) => {
    
  
    res.render("sign-up", {
      title: "Sign Up"
    });
  });


  exports.sign_up_post = [

    // Validate and sanitize fields.
    body("first_name", "First Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("last_name", "Last Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("email", "Email must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "Password must not be empty").isLength({ min: 1 }).escape(),
  body("membership_status.*").escape(),
// Process request after validation and sanitization.
asyncHandler( async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    try {
      const user = new User({
        first_name : req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.username,
        password: hashedPassword,
      });
      req.session.user = user;
      res.redirect("/membership/passcode");
    } catch(err) {
      return next(err);
    };
  });
  }),
];
exports.passcode_get = 
asyncHandler(async (req, res, next) => {
    
  
    res.render("passcode", {
      title: "Membership",
      errorMessage: "",
    });
  });

  exports.passcode_post = 
  asyncHandler(async (req, res, next) => {
    if(req.body.passcode == "cats"){
    try {
       
        const userData = req.session.user;
        const user= new User(userData)
        const result = await user.save();
        res.redirect("/");
       } 
       catch(err) {
        return next(err);
      }} else { res.render('passcode',{
        errorMessage: "Wrong passcode try again",
      }); }
  });

exports.sign_in_get = asyncHandler(async (req, res, next) => {
    
  
    res.render("sign-in", {
      title: "Sign In"
    });
  });

  exports.sign_in_post = asyncHandler(async (req, res, next) => {
    if(req.body.passcode === 'cats'){
        await(User.findByIdAndUpdate(id, {membership_status: true}))
    }
  
    res.redirect("/");
  });