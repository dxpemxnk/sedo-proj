const router = require("express").Router();
const {
  getAllCategoryController,} = require('../controllers/CatController')

  router
  .get("/", getAllCategoryController)
  module.exports = router;