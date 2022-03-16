const express = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();
const passport = require("passport");

// @desc    Auth with Google
// @route   GET /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  authController.getGoogleCallback
);
// @desc    Auth with Facebook
// @route   GET /auth/facebook
router.get("/facebook", passport.authenticate("facebook"));

// @desc    Facebook auth callback
// @route   GET /auth/facebook/callback
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  authController.getFacebookCallback
);

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Invalid email address.")
      .normalizeEmail({ gmail_remove_dots: false }),
  ],
  authController.postLogin
);

router.post(
  "/signup",
  [
    body("firstName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("First Name must be at least 2 characters long.")
      .isAlpha()
      .withMessage("First Name must be alphabetic."),
    body("lastName")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Last Name must be at least 2 characters long.")
      .isAlpha()
      .withMessage("Last Name must be alphabetic."),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(`${userDoc.email} has already been used, please pick a different e-mail or Log-in.`);
          }
        });
      })
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      "password",
      "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    )
      .isLength({ min: 8 }).withMessage("Please enter a password with minimum eight characters.")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]/).withMessage("Please enter a password with at least one uppercase letter, one lowercase letter, one number and one special character.")
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);
router.get("/new-password", authController.getNewPassword);

router.post(
  "/new-password",
  [
    body(
      "password",
      "Please enter a password with minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .trim(),
    body("confirmPassword")
      .trim()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords have to match!");
        }
        return true;
      }),
  ],
  authController.postNewPassword
);

module.exports = router;
