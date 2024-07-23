const express = require("express");
const router = express.Router();
const bidController = require("../../controllers/bidController");

router.route("/createBid").post(bidController.createNewBid);

module.exports = router;
