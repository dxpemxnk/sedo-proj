const { Category } = require("../db/models");

class CategoryService {
  static async getAllCategory() {
    try {
      const categories = await Category.findAll({
        order: [["id", "ASC"]],
      });

      return categories;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = CategoryService;
