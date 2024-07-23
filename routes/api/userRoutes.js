const express = require("express");
const router = express.Router();
const userController = require("../../controllers/userController");

router.route("/favourites").put(userController.userFavouriteProducts);
router.route("/updateUser").put(userController.updateUser);

module.exports = router;
