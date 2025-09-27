"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      //User.hasMany(models.Doc,{foreignKey:"user_id", as:"doc"})
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.TEXT,
      password: DataTypes.TEXT,
      role: DataTypes.TEXT,
      phone: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
