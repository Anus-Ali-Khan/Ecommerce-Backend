const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middlewares/verifyRoles");

router.route("/").put(userController.userFavouriteProducts);

module.exports = router;
