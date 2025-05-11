"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class allcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      allcode.hasMany(models.User, {
        foreignKey: "positionId",
        as: "positionData",
      });
      allcode.hasMany(models.User, { foreignKey: "gender", as: "genderData" });

      allcode.hasMany(models.Schedule, {
        foreignKey: "timeType",
        as: "timeTypeData",
      });

      allcode.hasMany(models.Doctor_Infor, {
        foreignKey: "priceId",
        as: "priceTypeData",
      });
      allcode.hasMany(models.Doctor_Infor, {
        foreignKey: "provinceId",
        as: "provinceTypeData",
      });
      allcode.hasMany(models.Doctor_Infor, {
        foreignKey: "paymentId",
        as: "paymentTypeData",
      });
    }
  }
  allcode.init(
    {
      keyMap: DataTypes.STRING,
      type: DataTypes.STRING,
      valueEn: DataTypes.STRING,
      valueVi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "allcode",
    }
  );
  return allcode;
};
