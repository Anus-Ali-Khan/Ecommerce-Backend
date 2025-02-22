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
      }

      const bidByCurrentUser = biddedProduct.bidAmounts.filter(
        (item) => item.userId == req.user.id
      );

      if (bidByCurrentUser.length === 0) {
        const bidAmounts = [
          ...biddedProduct.bidAmounts,
          { price: bidPrice, userId: req.user.id },
        ];
        const updateBid = await Bid.findOneAndUpdate(
          { productId: productId },
          { bidAmounts: bidAmounts },
          { new: true }
        );
        return res.status(201).json({
          success: true,
          updateBid,
          message: `Bid on product ${productId} has placed successfully`,
        });
      }

      if (bidByCurrentUser.length) {
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
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product ID required" });
  }

  try {
    //aggregate pipelines are used to fetch data from array of objects in MongoDB Schema
    // const bid = Bid.aggregate([
    //   { $unwind: "$bidAmounts" },
    //   { $match: { "bidAmounts._id": bidId } },
    // ]);
    const bid = await Bid.findOne({ productId: productId }).exec();
    let bidAmounts = [...bid.bidAmounts];

    const deleteBid = bidAmounts.filter((item) => item.userId == req.user.id);
    if (deleteBid) {
      bidAmounts = bidAmounts.filter((item) => item != deleteBid[0]);
    }

    const updatedBidAmounts = Bid.findOneAndUpdate(
      { productId: productId },
      { bidAmounts: bidAmounts },
      { new: true }
    ).exec();

    res.json({
      success: true,
      deleteBid,
      message: "Bid has deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Get All Bids
const getAllBids = async (req, res) => {
  try {
    const bids = await Bid.find();
    if (!bids) {
      return res.status(204).json({ message: "No bid found." });
    }
    res.json({ success: true, bids });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Get Single Bid
const getSingleBid = async (req, res) => {
  const { productId } = req.params;
  if (!productId) {
    res.status(400).json({ message: "ID parameter is required." });
  }
  try {
    const bid = await Bid.findOne({ productId: productId }).exec();
    if (!bid) {
      return res
        .status(204)
        .json({ message: `No bid matches ID ${productId}` });
    }
    res.json({ success: true, bid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// User bidded products
const userBiddedProducts = async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  try {
    // query to find userId inside array of objects
    const userBiddedProducts = await Bid.find({
      "bidAmounts.userId": userId,
    }).exec();
    if (!userBiddedProducts) {
      res.status(204).message({
        succes: false,
        message: `This user ${userId} has not bidded yet.`,
      });
    }
    res.json({ success: true, userBiddedProducts });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createNewBid,
  updateBidList,
  deleteBid,
  getAllBids,
  getSingleBid,
  userBiddedProducts,
};
