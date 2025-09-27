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
          password: bcrypt.hashSync("1", saltRounds),
          role: "Admin",
          phone: 213456,
        },
        {
          name: "Joe Peach",
          email: "joe@mail.ru",
          password: bcrypt.hashSync("1", saltRounds),
          role: "Manager",
          phone: 734589,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {

      await queryInterface.bulkDelete('Users', null, {});
     
  },
};
