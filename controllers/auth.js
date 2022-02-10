const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");

  if (errMsg[0]) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errMessage: errMsg,
    successMessage: successMsg,
    oldInput: {
      email: "",
      password: "",
    },
    validationErrors: [],
  });
};

exports.getGoogleCallback = (req, res) => {
  req.session.isLoggedIn = true;
  req.session.user = req.body.user;
  req.session.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
};

exports.getFacebookCallback = (req, res) => {
  req.session.isLoggedIn = true;
  req.session.user = req.body.user;
  req.session.save((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
};

exports.getSignup = (req, res, next) => {
  let errMsg = req.flash("error");

  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errMessage: errMsg,
    oldInput: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errMessage: errors.array()[0].msg,
      successMessage: null,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errMessage: "Invalid email or password.",
          successMessage: null,
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errMessage: "Invalid email or password.",
            successMessage: null,
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errMessage: errors.array()[0].msg,
      successMessage: null,
      oldInput: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: hashedPassword,
        plantList: [],
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/auth/login");
      return transporter.sendMail({
        to: email,
        from: "plantparentapplication@gmail.com",
        subject: "Signup to Plant Parent successful!",
        html: "<h1>You successfully signed up!</h1><p>You can now log in with your email and password.</p>",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      console.log(err);
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let errMsg = req.flash("error");
  let successMsg = req.flash("success");

  if (errMsg[0]) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errMessage: errMsg,
    successMessage: successMsg,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/auth/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/auth/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        req.flash(
          "success",
          "Check your mailbox and click the link to reset your password. Note that it may take few minutes for the email to reach your mailbox."
        );
        res.redirect("/auth/reset");
        transporter.sendMail({
          to: req.body.email,
          from: "plantparentapplication@gmail.com",
          subject: "Password reset",
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="https://plant-parent-app.herokuapp.com/reset/${token}">link</a> to set a new password.</p>
        `,
        });
        return user.save();
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(err);
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  const user = req.user;

  if (token) {
    User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
      .then((user) => {
        let errMsg = req.flash("error");
        if (errMsg.length > 0) {
          errMsg = errMsg[0];
        } else {
          errMsg = null;
        }
        res.render("auth/new-password", {
          path: "/new-password",
          pageTitle: "New Password",
          errMessage: errMsg,
          userId: user._id.toString(),
          passwordToken: token,
          oldInput: {
            password: password,
            confirmPassword: confirmPassword,
          },
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    let errMsg = req.flash("error");
    if (errMsg.length > 0) {
      errMsg = errMsg[0];
    } else {
      errMsg = null;
    }
    res.render("auth/new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errMessage: errMsg,
      userId: user._id.toString(),
      passwordToken: null,
      oldInput: {
        password: "",
        confirmPassword: "",
      },
      validationErrors: [],
    });
  }
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  const user = req.user;
  let resetUser;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // console.log(errors.array());
    return res.status(422).render("auth/new-password", {
      path: "/new-password",
      pageTitle: "Change Password",
      errMessage: errors.array()[0].msg,
      successMessage: null,
      userId: user._id.toString(),
      passwordToken: null,
      oldInput: {
        password: newPassword,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  if (passwordToken === "" && req.session.isLoggedIn) {
    const hashedPasswordPromise = new Promise((resolve, reject) => {
      resolve(bcrypt.hash(newPassword, 12));
    })
      .then((hashedPassword) => {
        user.password = hashedPassword;
        return user.save();
      })
      .then((result) => {
        req.session.isLoggedIn = false;

        return req.session.save((err) => {
          if (err) {
            console.log(err);
          }
          req.flash("success", "Password has been successfully changed. Please, log in with your new password.");
          res.redirect("/auth/login");
        });
      })
      .catch((err) => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  } else {
    User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId,
    })
      .then((user) => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
      })
      .then((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
      })
      .then((result) => {
        res.redirect("/auth/login");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  }
};
