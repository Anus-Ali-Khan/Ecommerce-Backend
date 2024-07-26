const Product = require("../models/Product");

//Get Products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products) {
      return res.status(204).json({ message: "No products found." });
    }
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//Create Product
const createNewProduct = async (req, res) => {
  // Checking the body params that are allowed
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

// Update or Edit Product
const updateProduct = async (req, res) => {
  // Checking allowed params
  const params = Object.keys(req.body);
  const allowedParams = [
    "productId",
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
    .find((val) => val.status === false);

  if (isValidParams) {
    res.status(400).json({
      sucess: false,
      message: `Invalid parameter ${isValidParams.name}`,
    });
  }

  try {
    if (!req?.body?.productId) {
      return res.status(400).json({ message: "ID parameter is required." });
    }

    const product = await Product.findOne({ _id: req.body.productId }).exec();
    if (!product) {
      return res
        .status(204)
        .json({ message: `No Employee matches ID ${req.body.id}.` });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      { _id: req.body.productId },
      { ...req.body },
      { new: true }
    );

    return res.json({
      success: true,
      updatedProduct,
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ message: "Product ID required." });
  }
  try {
    const product = await Product.findOne({ _id: req.body.id }).exec();
    if (!product) {
      return res
        .status(204)
        .json({ message: `No product matches ID ${req.body.id}` });
    }
    const deletedProduct = await product.deleteOne({ _id: req.body.id });
    res.json({
      success: true,
      product,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Single Product
const getSingleProduct = async (req, res) => {
  if (!req?.params?.id) {
    return res.status(400).json({ message: "Product ID required." });
  }
  try {
    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
      return res
        .status(204)
        .json({ message: `No product matches ID ${req.params.id}` });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};
