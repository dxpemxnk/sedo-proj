const route = require("express").Router();
const DocController = require("../controllers/DocController");

const varifyAccessToken = require("../middleware/varifyAccessToken");

module.exports = route
  .get("/", DocController.getAllDocsController)
  .post("/", varifyAccessToken,DocController.createDocController)
  .delete("/:id",  varifyAccessToken,DocController.deleteDocController)
  .put("/:id", varifyAccessToken, DocController.updateDocController)
  .get("/:id", DocController.getOneDocController);
