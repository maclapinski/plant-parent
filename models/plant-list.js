const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PlantList = sequelize.define('plantList', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = PlantList;
