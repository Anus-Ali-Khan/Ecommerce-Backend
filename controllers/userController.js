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

    res.json({
      success: true,
      currentUser,
      message: "Successfully updated favourites",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Intenal Server Error",
    });
  }
};

module.exports = { userFavouriteProducts };
