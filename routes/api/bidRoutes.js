const express = require("express");
const router = express.Router();
const bidController = require("../../controllers/bidController");

router.route("/createBid").post(bidController.createNewBid);
router.route("/updateBid").put(bidController.updateBidList);
router.route("/deleteBid").delete(bidController.deleteBid);
router.route("/getAllBids").get(bidController.getAllBids);
router.route("/getSingleBid/:productId").get(bidController.getSingleBid);
router
  .route("/userBiddedProducts/:userId")
  .get(bidController.userBiddedProducts);

module.exports = router;
