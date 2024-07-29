const User = require("../models/User");

// User Favourites Product
const userFavouriteProducts = async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    res
      .status(400)
      .json({ success: false, message: "ID parameter is required" });
  }
  try {
    let favouritesArray = [...req.user.favourites];
    const favProduct = favouritesArray.includes(productId);
    if (favProduct) {
      favouritesArray = favouritesArray.filter((item) => item !== productId);
    } else {
      favouritesArray = [...favouritesArray, productId];
    }

    const currentUser = await User.findByIdAndUpdate(
      req.user.id,
      { favourites: favouritesArray },
      { new: true }
    );

    return res.json({
      success: true,
      currentUser,
      message: "Successfully updated favourites",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Intenal Server Error",
    });
  }
};

//Update User
const updateUser = async (req, res) => {
  const { name, image, email, phoneNo } = req.body;
  if (!name || !image || !email || !phoneNo) {
    return res.status(400).json({ message: "Please provide valid fields." });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, image, email, phoneNo }, // it replaces the old parameters with new parameters that we passed in body
      { new: true }
    );
    // if (!updatedUser.id) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: `User ${name} is not logged in.` });
    // }
    return res.json({
      success: true,
      updatedUser,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Intenal Server Error",
    });
  }
};

module.exports = { userFavouriteProducts, updateUser };
