'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class doctor_infor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      doctor_infor.belongsTo(models.User, { foreignKey: 'doctorId' })
      doctor_infor.belongsTo(models.Allcode, { foreignKey:'priceId',targetKey: 'keyMap'  , as :'priceData'}),
      doctor_infor.belongsTo(models.Allcode, { foreignKey: 'provinceId',targetKey: 'keyMap' , as: 'provinceData' }),
      doctor_infor.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentData' }),
      doctor_infor.belongsTo(models.specialty, { foreignKey:'specialtyId',targetKey: 'id'  , as :'specialtyData'})
    }
  }
  doctor_infor.init({
      doctorId: DataTypes.INTEGER,
      specialtyId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'doctor_infor',
    freezeTableName: true
  });
  return doctor_infor;
};