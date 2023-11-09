const express = require("express");
const router = express.Router();
const passport = require("passport");

// Require controller modules.

const user_controller = require("../controllers/userController");
const message_controller = require("../controllers/messageController");

/// User ROUTES ///

// GET catalog home page.
router.get("/", user_controller.index);

// GET request for creating a user.
router.get("/sign-up", user_controller.sign_up_get);

// POST request for creating a user.
router.post("/sign-up", user_controller.sign_up_post);

// GET request for singing in  a user.
router.get("/sign-in", user_controller.sign_in_get);

// POST request for singing in  a user.
router.post("/sign-in", user_controller.sign_in_post);

// GET request for passcode in  a user.
router.get("/passcode", user_controller.passcode_get);

// POST request for passcode in  a user.
router.post("/passcode", user_controller.passcode_post);

// GET request for log out in  a user.
router.get("/log-out", user_controller.logOut_get);

// POST request for create message .
router.post("/post-message", message_controller.create_message_post);

// POST request for erase message .
router.post("/erase", message_controller.erase_message_post);

//, passport.authenticate("local", { failureRedirect: "/" })
module.exports = router;
