const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Plant = sequelize.define("plant", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
//   light: {
//     type: Sequelize.JSON,
//     allowNull: false,
//   },
//   direction: {
//     type: Sequelize.JSON,
//     allowNull: false,
//   },
//   pets: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//   },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Plant
