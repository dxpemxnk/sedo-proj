'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Docs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      category_id: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:"Categories",
          },
          key:"id",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        references:{
          model:{
            tableName:"Users",
          },
          key:"id",
        },
      },
      signed: {
        type: Sequelize.BOOLEAN
      },
      date_start: {
        type: Sequelize.DATE
      },
      date_end: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Docs');
  }
};