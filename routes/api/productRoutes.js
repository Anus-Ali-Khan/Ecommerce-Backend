const express = require("express");
const router = express.Router();
const productsController = require("../../controllers/productsController");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middlewares/verifyRoles");

router
  .route("/")
  .get(productsController.getAllProducts)
  .post(productsController.createNewProduct)
  .put(productsController.updateProduct)
  .delete(verifyRoles(ROLES_LIST.Admin), productsController.deleteProduct);

router.route("/:id").get(productsController.getSingleProduct);

module.exports = router;
