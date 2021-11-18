const Plant = require('../models/plant');

exports.getIndexPage = (req, res, next) => {
  let fetchedPlants;
  Plant.findAll()
    .then((plants) => {
      fetchedPlants = plants;
    })
    .then(
      req.user.getPlantList().then((plantList) => {
        return plantList
          .getPlants()
          .then((plants) => {
            res.render('main/index', {
              path: '/',
              pageTitle: 'Index',
              myPlants: plants,
              plants: fetchedPlants,
            });
          })
          .catch((err) => console.log(err));
      })
    )
    .catch((err) => console.log(err));
};

exports.postAddToPlants = (req, res, next) => {
  const plantId = req.body.plantId;
  let fetchedPlantList;
  req.user
    .getPlantList()
    .then((plantList) => {
      fetchedPlantList = plantList;
      return plantList.getPlants({ where: { id: plantId } });
    })
    .then((plants) => {
      let plant;
      if (plants.length > 0) {
        plant = plants[0];
      }

      return Plant.findByPk(plantId);
    })
    .then((plant) => {
      return fetchedPlantList.addPlant(plant);
    })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.postDeleteFromPlantList = (req, res, next) => {
  const plantId = req.body.plantId;
  req.user
    .getPlantList()
    .then((plantList) => {
      return plantList.getPlants({ where: { id: plantId } });
    })
    .then((plants) => {
      const plant = plants[0];
      return plant.plantListItem.destroy();
    })
    .then((result) => {
      res.redirect('/');
    });
};
