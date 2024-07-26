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
    const product = await Product.findById(productId).exec(); // find by id only works on _id(which is mongodb built in)
    if (product) {
      const biddedProduct = await Bid.findOne({ productId: productId }).exec(); // to find document with your own referencr use find() or findOne() method
      // console.log(biddedProduct);
      if (!biddedProduct) {
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
        res.status(400).json({
          success: false,
          message: "You have already bidded on this product",
        });
      }
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

// update Bid List
const updateBidList = async (req, res) => {
  //Checking Allowed Params
  const params = Object.keys(req.body);
  const allowedParams = ["productId", "endTime", "bidPrice"];

  const isValidParams = params
    .map((param) => {
      if (allowedParams.includes(param)) {
        return { name: param, status: true };
      } else {
        return { name: param, status: false };
      }
    })
    .find((val) => val.status === false);

  if (isValidParams) {
    return res.status(400).json({
      success: false,
      message: `Inavlid parameter ${isValidParams.name}`,
    });
  }

  try {
    if (!req?.body?.productId) {
      return res.status(400).json({ message: "ID parameter is required" });
    }

    const product = await Product.findOne({
      _id: req.body.productId,
    }).exec();
    if (!product) {
      return res
        .status(204)
        .json({ message: `No product matches ID ${req.body.productId}.` });
    }

    const bid = await Bid.findOne({ productId: req.body.productId }).lean();
    if (bid) {
      const updatedBidPrice = bid.bidAmounts.map((obj) => {
        if (String(obj.userId) === req.user.id) {
          return { ...obj, price: req.body.bidPrice };
        } else {
          return obj;
        }
      });

      const updatedBid = await Bid.findOneAndUpdate(
        { productId: req.body.productId },
        {
          endTime: req.body.endTime,
          bidAmounts: updatedBidPrice,
        },
        { new: true }
      );
      return res.json({
        success: true,
        updatedBid,
        message: "Bid updated successfully",
      });
    } else {
      return res.json({
        message: `This product ${req.body.productId} has not been bidded yet.`,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Bid
const deleteBid = async (req, res) => {
  const { bidId } = req.body;

  if (!bidId) {
    return res.status(400).json({ message: "Product ID required" });
  }

  try {
    // const bid =
  } catch (err) {
    console.error(err);
  }
};

module.exports = { createNewBid, updateBidList };
