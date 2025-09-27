"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Обычный",
        },
        {
          name: "Секретный",
        },
        {
          name: "Для служебного пользования",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {

      await queryInterface.bulkDelete('Categories', null, {});
     
  },
};
