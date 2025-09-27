const { User } = require("../db/models");



class UserService {

  static async getAllUser() {
    try {
      const user = await User.findAll();
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  static async addUser({ name,email, password,role,phone } = {}) {
    try {
      const user = await User.create({
        name,
        email,
        password,
        role,
        phone,
      });
      return user.get();
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getUserByEmail(email) {
    try {
      const user = await User.findOne({ where: { email } });
      console.log(user)
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = UserService;
