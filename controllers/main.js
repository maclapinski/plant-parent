const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const stripe = require("stripe")(
  "sk_test_51KOpmTJ4zi1Q2DNBMCPL6hi0XRrp16NzOBFKRiVXNtRwtjutF2Ikjoc6eNfvIm2yzcVNXhW2kgnPQHi4gIHHtFRV00mZ4HY8FD"
);

const Plant = require("../models/plant");
const User = require("../models/user");
const Subscriber = require("../models/subscriber");

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  })
);

exports.getIndexPage = (req, res, next) => {
  let successMsg = req.flash("success");
  let errMsg = req.flash("error");

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }
  res.render("main/index", {
    path: "/",
    pageTitle: "Index",
    errorMessage: errMsg,
    successMessage: successMsg,
  });
};
exports.getNewIndexPage = (req, res, next) => {
  let successMsg = req.flash("success");
  let errMsg = req.flash("error");

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }
  res.render("main/new_index", {
    path: "/",
    pageTitle: "Index",
    errorMessage: errMsg,
    successMessage: successMsg,
  });
};
exports.getPrivacyPolicy = (req, res, next) => {
  let successMsg = req.flash("success");
  let errMsg = req.flash("error");
  res.render("main/privacy-policy", {
    path: "/privacy-policy",
    pageTitle: "Privacy Policy",
  });
};

exports.getPlants = async (req, res, next) => {
  const usrPlants = [];
  const usrWishList = [];
  try {
    const plants = await Plant.find();

    if (req.user) {
      for (item of req.user.plantList) {
        usrPlants.push(item.plant.toString());
      }
      for (item of req.user.wishList) {
        usrWishList.push(item.plant.toString());
      }
    }
    res.render("main/plants", {
      path: "/plants",
      pageTitle: "All Plants",
      plants: plants,
      userPlants: usrPlants,
      userWishList: usrWishList,
      deleteFromWishList: req.deleteFromWishList ? true : false,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getPlantDetails = async (req, res, next) => {
  const plantId = req.params.plantId;
  let inUsrPlants = false;

  try {
    const plant = await Plant.findById(plantId);

    if (req.user) {
      for (item of req.user.plantList) {
        if (item.plant.toString() === plantId) {
          inUsrPlants = true;
        }
      }
    }
    res.render("main/plant-details", {
      plant: plant,
      pageTitle: plant.name,
      path: "",
      deleteFromWishList: req.deleteFromWishList ? true : false,
      isInUserPlants: inUsrPlants,
    });
  } catch (err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getUserWishList = async (req, res, next) => {
  try {
    const user = await req.user.populate("wishList.plant");
    res.render("main/user-wish-list", {
      path: "/user-wish-list",
      pageTitle: "My Wishlist",
      userWishList: user.wishList,
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUserPlantList = async (req, res, next) => {
  try {
    const user = await req.user.populate("plantList.plant");
    const plants = user.plantList;
    console.log(plants);
    res.render("main/user-plant-list", {
      path: "/user-plant-list",
      pageTitle: "My Plants",
      plants: plants,
      userPlants: plants,
      userWishList: [],
      errorMessage: req.flash("error"),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getSearch = (req, res, next) => {
  let errMsg = req.flash("error");
  const plants = req.body.plants ? req.body.plants : [];

  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }

  res.render("main/search", {
    path: "/search",
    pageTitle: "Search",
    errMessage: errMsg,
    plants: plants,
    oldInput: {
      lowLight: "",
      mediumLight: "",
      brightLight: "",
      easy: "",
      medium: "",
      advanced: "",
      petSafe: false,
    },
  });
};

exports.getProfile = (req, res, next) => {
  const user = req.user;

  console.log(user);
  res.render("main/profile", {
    path: "/profile",
    pageTitle: "User Profile",
    user: user,
    errorMessage: req.flash("error"),
  });
};

exports.getPremium = (req, res, next) => {
  const user = req.user;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/subscribe");
    }
    const token = buffer.toString("hex");
    User.findOne({
      _id: user._id,
    })
      .then((user) => {
        user.setPremiumToken(token);
      })
      .then((result) => {
        const items = [
          {
            name: "Premium membership",
            description:
              "Premium membership gives the user access to user forum. CAUTION! THIS IS JUST A TEST. USE FAKE CREDIT CARD DETAILS",
            amount: 99,
            currency: "usd",
            quantity: 1,
          },
        ];

        return stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: items,
          success_url: req.protocol + "://" + req.get("host") + "/premium/success/" + token, // => http://localhost:3000
          cancel_url: req.protocol + "://" + req.get("host") + "/premium/cancel",
        });
      })
      .then((session) => {
        res.render("main/premium", {
          path: "/premium",
          pageTitle: "Premium membership details",
          sessionId: session.id,
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(err);
        return next(error);
      });
  });
};

exports.getPremiumSuccess = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ premiumSubscriptionToken: token, premiumSubscriptionTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      user.isPremium = true;
      user.premiumSubscriptionToken = undefined;
      user.premiumSubscriptionTokenExpiration = undefined;
      return user.save();
    })
    .then(() => {
      res.render("main/premium-success", {
        path: "/premium",
        pageTitle: "Premium Membership Success",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getSubscribe = (req, res, next) => {
  let errMsg = req.flash("error");

  if (errMsg.length > 0) {
    errMsg = errMsg[0];
  } else {
    errMsg = null;
  }
  res.render("main/subscribe", {
    path: "/",
    pageTitle: "Subscribe",
    errorMessage: errMsg,
  });
};

exports.postAddToUserPlantList = (req, res, next) => {
  const plantId = req.params.plantId;
  let onUserWishList = false;

  for (item of req.user.wishList) {
    if (item.plant.toString() === plantId) {
      onUserWishList = true;
    }
  }

  Plant.findById(plantId)
    .then((plant) => {
      return req.user.addToUserPlantList(plant);
    })
    .then((result) => {
      if (onUserWishList) {
        req.user.deleteFromUserWishList(plantId);
      }
    })
    .then(() => {
      console.log("ADDED PLANT");
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Adding Plant failed." });
    });
};

exports.postAddToUserWishList = (req, res, next) => {
  const plantId = req.params.plantId;

  Plant.findById(plantId)
    .then((plant) => {
      return req.user.addToUserWishList(plant);
    })
    .then(() => {
      console.log("ADDED PLANT");
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Adding Plant failed." });
    });
};

exports.deleteFromUserWishList = (req, res, next) => {
  const plantId = req.params.plantId;

  return req.user
    .deleteFromUserWishList(plantId)
    .then(() => {
      console.log("DESTROYED PLANT");
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting Plant failed." });
    });
};
exports.deleteFromUserPlantList = (req, res, next) => {
  const plantId = req.params.plantId;

  return req.user
    .deleteFromUserPlantList(plantId)
    .then(() => {
      console.log("DESTROYED PLANT");
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting Plant failed." });
    });
};

exports.postSearch = (req, res, next) => {
  const difficulty = typeof req.body.difficulty === "string" ? [req.body.difficulty] : req.body.difficulty;
  const light = typeof req.body.light === "string" ? [req.body.light] : req.body.light;
  const petSafe = req.body.petSafe ? true : false;
  const difficultyList = [];
  const lightList = [];
  let lightQuery;
  let difficultyQuery;
  let lowLight = "";
  let mediumLight = "";
  let brightLight = "";
  let easy = "";
  let medium = "";
  let advanced = "";
  let query;
  const usrPlants = [];
  const usrWishList = [];

  if (req.user) {
    for (item of req.user.plantList) {
      usrPlants.push(item.plant.toString());
    }
    for (item of req.user.wishList) {
      usrWishList.push(item.plant.toString());
    }
  }

  if (typeof light === "object") {
    for (item of light) {
      switch (item) {
        case "low":
          lowLight = "checked";
          break;
        case "medium":
          mediumLight = "checked";
          break;
        case "bright":
          brightLight = "checked";
      }

      const object = { light: item };
      lightList.push(object);
    }
    lightQuery = { $or: lightList };
  } else {
    lightQuery = {};
  }

  if (typeof difficulty === "object") {
    for (item of difficulty) {
      switch (item) {
        case "easy":
          easy = "checked";
          break;
        case "medium":
          medium = "checked";
          break;
        case "advanced":
          advanced = "checked";
      }

      const object = { difficulty: item };
      difficultyList.push(object);
    }
    difficultyQuery = { $or: difficultyList };
  } else {
    difficultyQuery = {};
  }

  if (petSafe) {
    query = { $and: [difficultyQuery, lightQuery, { petSafe: petSafe }] };
  } else {
    query = { $and: [difficultyQuery, lightQuery] };
  }

  Plant.find(query)
    .then((plants) => {
      if (plants.length < 1) {
        return res.render("main/search", {
          path: "/search",
          pageTitle: "Search",
          plants: plants,
          errMessage: "No suitable plants found.",
          oldInput: {
            lowLight: lowLight,
            mediumLight: mediumLight,
            brightLight: brightLight,
            easy: easy,
            medium: medium,
            advanced: advanced,
            petSafe: petSafe,
          },
        });
      }
      res.render("main/search", {
        path: "/search",
        pageTitle: "Search Results",
        errMessage: null,
        plants: plants,
        userPlants: usrPlants,
        userWishList: usrWishList,
        oldInput: {
          lowLight: lowLight,
          mediumLight: mediumLight,
          brightLight: brightLight,
          easy: easy,
          medium: medium,
          advanced: advanced,
          petSafe: petSafe,
        },
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postSubscribe = (req, res, next) => {
  if (!req.user.email && !req.body.email) {
    return res.redirect("/subscribe");
  }
  const email = req.body.email ? req.body.email : req.user.email;

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/subscribe");
    }
    const token = buffer.toString("hex");
    Subscriber.findOne({
      email: email,
    })
      .then((subscriber) => {
        if (subscriber !== null) {
          req.flash("error", `Subscription for ${email} already active`);
          return res.redirect("/subscribe");
        }
        const newSubscriber = new Subscriber({
          email: email,
          subscriptionToken: token,
        });
        return newSubscriber.save();
      })
      .then((result) => {
        if (result) {
          req.flash("success", "Thank you for subscribing to our newsletter!");
          res.redirect("/");
          transporter.sendMail({
            to: email,
            from: "plantparentapplication@gmail.com",
            subject: "Newsletter Subscription",
            html: `
                  <p>Thank you for subscribing to our newsletter!</p>
                  <p>You can unsubscribe anytime by clicking <a href="https://plant-parent-app.herokuapp.com/unsubscribe/${token}">unsubscribe</a>.</p>
                `,
          });
          console.log("subscription confirmation sent to ", email);
        }
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        console.log(err);
        return next(error);
      });
  });
};

exports.getUnsubscribe = (req, res, next) => {
  const token = req.params.token;
  Subscriber.findOne({ resetToken: token })
    .then((subscriber) => {
      const id = subscriber._id;
      const email = subscriber.email;
      let errMsg = req.flash("error");

      if (errMsg.length > 0) {
        errMsg = errMsg[0];
      } else {
        errMsg = null;
      }

      Subscriber.findByIdAndDelete(id)
        .then(() => {
          req.flash("success", "You have successfully unsubscribed from our newsletter.");
          res.redirect("/");
          transporter.sendMail({
            to: email,
            from: "plantparentapplication@gmail.com",
            subject: "Newsletter Subscription",
            html: `       
                <h2>Sorry to see you go.</h2>
                <p>You have successfully unsubscribed from our newsletter.</p>
                <p>Your email address has also been removed from our mailing list. You will receive no more emails from us.</p>
                <p>If you have unsubscribed by mistake, please feel free to <a href="https://plant-parent-app.herokuapp.com/subscribe/">subscribe</a> at any time.</p>
                `,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
