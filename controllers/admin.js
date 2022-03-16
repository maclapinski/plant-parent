const Plant = require("../models/plant");

exports.getAdminPage = (req, res, next) => {
  let successMsg = req.flash("success");

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  Plant.find().sort({name:1})
    .then((plants) => {
      res.render("admin/admin", {
        plants: plants,
        pageTitle: "Admin Dashboard",
        path: "/admin",
        successMessage: successMsg,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPlant = (req, res, next) => {
  const editMode = req.query.edit;
  let successMsg = req.flash("success");
  const plantId = req.params.plantId;

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  if (!editMode) {
    return res.render("admin/edit-plant", {
      path: "admin/edit-plant",
      pageTitle: "Edit Plant",
      editing: false,
      successMessage: successMsg,
    });
  }

  Plant.findById(plantId)
    .then((plant) => {
      if (!plant) {
        return res.render("admin/edit-plant", { editing: false });
      }
      res.render("admin/edit-plant", {
        pageTitle: "Edit Plant",
        path: "/admin/edit-plant",
        editing: editMode,
        plant: plant,
        successMessage: successMsg,
      });
    })
        .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postAddPlant = (req, res, next) => {
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const light = req.body.light;
  const difficulty = req.body.difficulty;
  const petSafe = req.body.pets;
  const plant = new Plant({
    name: name,
    description: description,
    image: image,
    light: light,
    difficulty: difficulty,
    petSafe: petSafe,
  });

  plant
    .save()
    .then((result) => {
      req.flash("success", "Plant added to database.");
      res.redirect("/admin/edit-plant");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deletePlant = (req, res, next) => {
  const plantId = req.params.plantId;

  return Plant.findByIdAndDelete(plantId)
    .then(() => {
      console.log("DESTROYED PLANT");
      res.status(200).json({ message: "Success!" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Deleting PLant failed." });
    });
};

exports.postEditPlant = (req, res, next) => {
  const plantId = req.body.plantId;
  const updatedName = req.body.name;
  const updatedImageUrl = req.body.image;
  const updatedDesc = req.body.description;
  const updatedLight = req.body.light;
  const updatedDifficulty = req.body.difficulty;
  const updatedPetSafe = req.body.pets;

  Plant.findById(plantId)
    .then((plant) => {
      plant.name = updatedName;
      plant.description = updatedDesc;
      plant.image = updatedImageUrl;
      plant.light = updatedLight;
      plant.difficulty = updatedDifficulty;
      plant.petSafe = updatedPetSafe;
      return plant.save();
    })
    .then((result) => {
      req.flash("success", "Plant updated successfully.");
      res.redirect("/admin/");
    })
        .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
