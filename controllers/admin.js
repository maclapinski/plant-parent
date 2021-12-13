const Plant = require('../models/plant');

exports.getAdminPage = (req, res, next) => {
  Plant.fetchAll()
    .then((plants) => {
      res.render('admin/admin', {
        plants: plants,
        pageTitle: 'Admin Dashboard',
        path: '/admin',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPlant = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.render('admin/edit-plant', {
      path: 'admin/edit-plant',
      pageTitle: 'Edit Plant',
      editing: false,
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
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddPlant = (req, res, next) => {
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const plant = new Plant(name, description, imageUrl, null, req.user._id);

  plant
    .save()
    .then((result) => {
      res.redirect('/admin/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeletePlant = (req, res, next) => {
  const plantId = req.body.plantId;
  Plant.deleteById(plantId)
    .then(() => {
      res.redirect('/admin/');
    })
    .catch((err) => console.log(err));
};

exports.postEditPlant = (req, res, next) => {
  const plantId = req.body.plantId;
  const updatedName = req.body.name;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  const plant = new Plant(updatedName, updatedDesc, updatedImageUrl, plantId);
  plant
    .save()
    .then((result) => {
      res.redirect('/admin/');
    })
    .catch((err) => console.log(err));
};

exports.getEditPlants = (req, res, next) => {
  res.render('admin/edit-plants');
};
