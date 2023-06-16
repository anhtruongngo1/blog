'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      history.belongsTo(models.User, { foreignKey: 'patientId', targetKey: 'id', as: 'patientHistoryData' })
    }
  }
  history.init({
    patientId: DataTypes.INTEGER,
    doctorId : DataTypes.INTEGER,
    description: DataTypes.TEXT,
    files: DataTypes.TEXT,
    date : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'history',
  });
  return history;
};