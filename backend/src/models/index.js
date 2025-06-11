const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const models = {
  User: require('./user')(sequelize, DataTypes),
  Patient: require('./patient')(sequelize, DataTypes),
  LungScan: require('./lungScan')(sequelize, DataTypes),
  Prediction: require('./prediction')(sequelize, DataTypes),
};

models.sequelize = sequelize;
models.Sequelize = Sequelize;
require('./associations')(models);

module.exports = models;
