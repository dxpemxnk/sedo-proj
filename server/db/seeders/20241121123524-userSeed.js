const bcrypt = require('bcrypt');
const saltRounds = 10;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          name: "John Doe",
          email: "john@mail.ru",
          password: bcrypt.hashSync("123456", saltRounds),
          role: "Admin",
          phone: "1234567890",
        },
        {
          name: "Joe Peach",
          email: "joe@mail.ru",
          password: bcrypt.hashSync("123456", saltRounds),
          role: "Manager",
          phone: "9876543210",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {

      await queryInterface.bulkDelete('Users', null, {});
     
  },
};
