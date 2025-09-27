const CategoryService = require("../services/cat.service");

exports.getAllCategoryController = async (req, res) => {
  try {
    const categories = await CategoryService.getAllCategory();
    res.status(200).json({ message: "success", categories });
  } catch (error) {
    res.status(500).json({ message: error.message, categories: [] });
  }
};