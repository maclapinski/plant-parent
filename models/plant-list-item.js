const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const PlantListItem = sequelize.define('plantListItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = PlantListItem;
