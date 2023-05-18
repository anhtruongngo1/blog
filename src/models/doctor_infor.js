"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class doctorInfor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      doctorInfor.belongsTo(models.User, { foreignKey: 'doctorId' })

      doctorInfor.belongsTo(models.Allcode, {
        foreignKey: "priceId",
        targetKey: "keyMap",
        as: "priceData",
      }),
        doctorInfor.belongsTo(models.Allcode, {
          foreignKey: "paymentId",
          targetKey: "keyMap",
          as: "paymentData",
        }),
        doctorInfor.belongsTo(models.Allcode, {
          foreignKey: "provinceId",
          targetKey: "keyMap",
          as: "provinceData",
        });
        doctorInfor.belongsTo(models.specialty, {
          foreignKey: "specialtyId",
          targetKey: "id",
          as: "specialtyData",
        });
    }
  }
  doctorInfor.init(
    {
      specialtyId: DataTypes.INTEGER,
      doctorId: DataTypes.INTEGER,
      clinicId: DataTypes.INTEGER,
      priceId: DataTypes.STRING,
      provinceId: DataTypes.STRING,
      addressClinic: DataTypes.STRING,
      paymentId: DataTypes.STRING,
      nameClinic: DataTypes.STRING,
      note: DataTypes.STRING,
      count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "doctorInfor",
    }
  );
  return doctorInfor;
};
