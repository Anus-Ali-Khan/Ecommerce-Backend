const Product = require("../models/Product");

//Get Products
const getAllProducts = async (req, res) => {
  const products = await Product.find();
  if (!products) {
    return res.status(204).json({ message: "No products found." });
  }
  res.json(products);
};

//Create Product
const createNewProduct = async (req, res) => {
  // Checking the body params spelling mistakes
  const params = Object.keys(req.body);
  const allowedParams = [
    "name",
    "price",
    "description",
    "category",
    "image",
    "isFeatured",
  ];

  const isValidParams = params
    .map((param) => {
      if (allowedParams.includes(param)) {
        return { name: param, status: true };
      } else {
        return { name: param, status: false };
      }
    })
    .find((val) => {
      return val.status === false;
    });
  if (isValidParams) {
    res.status(400).json({
      sucess: false,
      message: `Invalid parameter ${isValidParams.name}`,
    });
  }

  //Check empty body
  if (params.length < 1) {
    return res
      .status(400)
      .json({ message: "Please provide all fields", success: false });
  }

  //Check Missing Parameters
  const missingParams = allowedParams
    .map((param) => {
      if (params.includes(param)) {
        return { name: param, status: true };
      } else {
        return { name: param, status: false };
      }
    })
    .find((val) => {
      return val.status === false;
    });

  if (missingParams) {
    return res
      .status(400)
      .json({ success: false, message: `Missing field ${missingParams.name}` });
  }
  try {
    const newProduct = await Product.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
      isFeatured: req.body.isFeatured,
      userId: req.user.id,
    });
    await newProduct.save();
    return res.status(201).json({
      success: true,
      newProduct,
      message: "Product created successfully",
    });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err.message,
    });
  }
};

module.exports = { getAllProducts, createNewProduct };
