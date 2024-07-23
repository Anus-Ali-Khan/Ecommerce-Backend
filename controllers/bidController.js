const Bid = require("../models/Bid");
const Product = require("../models/Product");

// create a new bid
const createNewBid = async (req, res) => {
  const { productId, bidPrice, startTime, endTime } = req.body;
  if (!productId || !bidPrice || !startTime || !endTime) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide valid parameters." });
  }

  try {
    const product = Product.findById(productId).exec();
    if (product) {
      const newBid = await Bid.create({
        bidAmounts: [{ price: bidPrice, userId: req.user.id }],
        startTime: startTime,
        endTime: endTime,
        productId: productId,
      });
      await newBid.save();
      return res.status(201).json({
        success: true,
        newBid,
        message: `Bid on product ${productId} has placed successfully`,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Product with Id ${productId} does not exists.`,
      });
    }
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message,
    });
  }
};

module.exports = { createNewBid };
