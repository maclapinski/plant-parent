const Plant = require('../models/plant');

exports.getAdminPage = (req, res, next) => {
  Plant.findAll()
    .then((plants) => {
      res.render('admin/dashboard', {
        plants: plants,
        pageTitle: 'Admin Dashboard',
        path: '/admin/dashboard',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditPlants = (req, res, next) => {
  res.render('admin/edit-plants');
};

exports.getEditPlant = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.render('admin/edit-plant', { editing: false });
  }
  const plantId = req.params.plantId;
  req.user
    .getPlants({ where: { id: plantId } })
    // Plant.findById(plantId)
    .then((plants) => {
      const plant = plants[0];
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
  req.user
    .createPlant({
      name: name,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      // console.log(result);
      console.log('Created plant');
      res.redirect('/admin/');
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postDeletePlant = (req, res, next) => {
  const plantId = req.body.plantId;
  Plant.findByPk(plantId)
    .then((plant) => {
      return plant.destroy();
    })
    .then((result) => {
      console.log('DESTROYED PLANT ID ' + plantId);
      res.redirect('/admin/');
    })
    .catch((err) => console.log(err));
};

exports.postEditPlant = (req, res, next) => {
  const plantId = req.body.plantId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Plant.findByPk(plantId)
    .then((plant) => {
      plant.title = updatedTitle;
      plant.description = updatedDesc;
      plant.imageUrl = updatedImageUrl;
      return plant.save();
    })
    .then((result) => {
      console.log('UPDATED PLANT!');
      res.redirect('/admin/');
    })
    .catch((err) => console.log(err));
};
