
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Docs",
      [
        {
          name: "Приказ",
          description: "Какой-то приказ",
          category_id: 2,
          user_id: 1,
          signed: true,
          date_start: "2022-10-10",
          date_end: "2025-10-10",
        },
        {
          name: "Приказ",
          description: "Какой-то приказ",
          category_id: 3,
          user_id: 2,
          signed: false,
          date_start: "2024-10-10",
          date_end: "2028-10-10",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
