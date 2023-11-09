const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const passport = require("passport");



exports.index = asyncHandler(async (req, res, next) => {
    // Get details of books, book instances, authors and genre counts (in parallel)
    const allMessages = await (await Message.find({}, "user text timestamp").
    sort({text: 1}).
    populate("user").
    populate("timestamp").
    exec());
  
    res.render("index", {
      title: "Members Only Home",
      user: req.user,
      errors: "",
      messages_list: allMessages, 

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
    .isLength({ min: 2 })
    .escape(),
  body("last_name", "Last Name must not be empty.")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("username", "Email must not be empty.")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .custom(async value => {
    const user = await User.findOne({ email: value });
    if (user) {
      throw new Error('E-mail already in use');
    }
  }),
  body("password", "Password must not be empty").isLength({ min: 4 }).escape(),
  body('passwordConfirmation', "Password do not match").custom((value, { req }) => {
    return value === req.body.password;
  }),
// Process request after validation and sanitization.
asyncHandler( async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
        // Store the errors in the flash messages
        errors.array().forEach((error) => {
          req.flash('error', error.msg);
        });
        // Render the sign-up page again with the errors
        return res.render('sign-up', { errors: req.flash('error') });
      }


    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
    try {
      const user = new User({
        first_name : req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.username,
        isAdmin: req.body.isAdmin,
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

  exports.sign_in_post =(
    "/sign-in",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
  );

  exports.logOut_get = ("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });