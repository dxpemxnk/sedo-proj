'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Doc extends Model {

    static associate(models) {
      Doc.belongsTo(models.Category, {foreignKey:"category_id" , as: "category"}),
      Doc.belongsTo(models.User,{foreignKey:"user_id"})
    }
  }
  Doc.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    category_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    signed: DataTypes.BOOLEAN,
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Doc',
  });
  return Doc;
};