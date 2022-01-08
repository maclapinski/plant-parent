const Plant = require('../models/plant');

exports.getAdminPage = (req, res, next) => {
  let successMsg = req.flash('success');

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }
  Plant.find()
    .then((plants) => {
      res.render('admin/admin', {
        plants: plants,
        pageTitle: 'Admin Dashboard',
        path: '/admin',
        successMessage: successMsg
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPlant = (req, res, next) => {
  const editMode = req.query.edit;
  let successMsg = req.flash('success');

  if (successMsg.length > 0) {
    successMsg = successMsg[0];
  } else {
    successMsg = null;
  }

  if (!editMode) {
    return res.render('admin/edit-plant', {
      path: 'admin/edit-plant',
      pageTitle: 'Edit Plant',
      editing: false,
      successMessage: successMsg
    });
  }

  const plantId = req.params.plantId;

  Plant.findById(plantId)
    .then((plant) => {
      if (!plant) {
        return res.render('admin/edit-plant', { editing: false });
      }
      res.render('admin/edit-plant', {
        pageTitle: 'Edit Plant',
        path: '/admin/edit-plant',
        editing: editMode,
        plant: plant,
        successMessage: successMsg
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddPlant = (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const light = req.body.light;
  const difficulty = req.body.difficulty;
  const isSafeForPets = req.body.pets;
  const plant = new Plant({
    name: name,
    description: description,
    imageUrl: imageUrl,
    light: light,
    difficulty: difficulty,
    isSafeForPets: isSafeForPets,
  });

  plant
    .save()
    .then((result) => {
      req.flash('success', 'Plant added to database.');
      res.redirect('/admin/edit-plant');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeletePlant = (req, res, next) => {
  const plantId = req.body.plantId;
  Plant.findByIdAndDelete(plantId)
    .then(() => {
      req.flash('success', 'Plant deleted from the database.');
      res.redirect('/admin/');
    })
    .catch((err) => console.log(err));
};

exports.postEditPlant = (req, res, next) => {
  const plantId = req.body.plantId;
  const updatedName = req.body.name;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Plant.findById(plantId)
    .then((plant) => {
      plant.name = updatedName;
      plant.description = updatedDesc;
      plant.imageUrl = updatedImageUrl;
      return plant.save();
    })
    .then((result) => {
      req.flash('success', 'Plant updated successfully.');
      res.redirect('/admin/');
    })
    .catch((err) => console.log(err));
};
