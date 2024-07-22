const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");
const ROLES_LIST = require("../../config/rolesList");
const verifyRoles = require("../../middlewares/verifyRoles");

router.route("/favourites").put(userController.userFavouriteProducts);
router.route("/updateUser").put(userController.updateUser);

module.exports = router;
