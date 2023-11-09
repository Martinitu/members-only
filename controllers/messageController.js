const User = require("../models/user");
const Message = require("../models/message");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const bcrypt = require('bcrypt');
const passport = require("passport");


exports.create_message_post = [
     // Validate and sanitize fields.
     body("message", "Message must not be empty.")
     .trim()
     .isLength({ min: 5 })
     .escape(),
     // Process request after validation and sanitization.
asyncHandler( async (req, res, next) => {
    const errors = validationResult(req);
    const allMessages = await (await Message.find({}, "user text timestamp").
    sort({text: 1}).
    populate("user").
    populate("timestamp").
    exec());
    if (!errors.isEmpty()) {
          // Store the errors in the flash messages
          errors.array().forEach((error) => {
            req.flash('error', error.msg);
          });
          // Render the index page again with the errors
          return res.render('index', {
            title: "Members Only Home",
            user: req.user,
            errors: req.flash('error'),
            messages_list: allMessages
           });
        };
        try {
            const message = new Message({
              user : req.user.id,
              text: req.body.message,
                
            });
            const result = await message.save();
     
            res.redirect("/");
          } catch(err) {
            return next(err);
          };
  
})

];

exports.erase_message_post = asyncHandler(async (req, res, next) => {
  const messageId = req.body.messageId;
  try {
    const result = await Message.findByIdAndRemove(messageId);
    if (result) {
      res.redirect("/");
    } else {
      res.status(404).send({ message: "Message not found" });
    }
  } catch (err) {
    return next(err);
  }
});