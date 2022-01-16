const crypto = require("crypto");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const Plant = require("../models/plant");
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

  Plant.find()
    .then((plants) => {
      res.render("main/index", {
        path: "/",
        pageTitle: "Index",
        plants: plants,
        errorMessage: errMsg,
        successMessage: successMsg,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPlants = (req, res, next) => {
  Plant.find()
    .then((plants) => {
      const usrPlants = [];
      if (req.user) {
        for (item of req.user.plantList) {
          usrPlants.push(item.plant.toString());
        }
      }

      res.render("main/plants", {
        path: "/plants",
        pageTitle: "All Plants",
        plants: plants,
        userPlants: usrPlants,
      });
    })
    .catch((err) => console.log(err));
};

exports.getPlant = (req, res, next) => {
  const plantId = req.params.plantId;
  Plant.findById(plantId)
    .then((plant) => {
      res.render("main/plant-detail", {
        plant: plant,
        pageTitle: plant.name,
        path: "/plants",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getUserPlantList = (req, res, next) => {
  req.user
    .populate("plantList.plant")
    // .execPopulate()
    .then((user) => {
      const plants = user.plantList;
      res.render("main/user-plants", {
        path: "/user-plants",
        pageTitle: "My Plants",
        plants: plants,
        errorMessage: req.flash("error"),
      });
    })
    .catch((err) => console.log(err));
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
console.log(user.photos)
  user.avatar = user.image
    ? user.image
    : user.image ? user.image : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&rounded=true`;
  res.render("main/profile", {
    path: "/profile",
    pageTitle: "User Profile",
    user: user,
    errorMessage: req.flash("error"),
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
  const plantId = req.body.plantId;
  Plant.findById(plantId)
    .then((plant) => {
      return req.user.addToUserPlantList(plant);
    })
    .then((result) => {
      res.redirect("/user-plants");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteFromUserPlantList = (req, res, next) => {
  const plantId = req.body.plantId;
  return req.user.deleteFromUserPlantList(plantId).then((result) => {
    res.redirect("/user-plants");
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
    query = { $and: [difficultyQuery, lightQuery, { isSafeForPets: petSafe }] };
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
    .catch((err) => console.log(err));
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
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
