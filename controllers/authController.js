const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, pwd } = req.body;
  if (!email || !pwd) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "Please provide valid email" }); //Unauthorized
    }
    //evaluate password
    const match = bcrypt.compare(pwd, foundUser.password);
    if (match) {
      //create jwts
      const accessToken = jwt.sign(
        {
          userInfo: {
            email: foundUser.email,
            id: foundUser._id,
            // roles: Object.values(foundUser.roles), //Object.values will return an array of foundUser.roles
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "2d" }
      );
      //Saving new refreshToken with current user
      foundUser.refreshToken = refreshToken;
      const user = await foundUser.save();

      //Since it is not secure to save refresh token in local storage so we are saving it as a cookie and as http only because http is not available to javascript
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 48 * 60 * 60 * 1000,
      });
      user.password = "Hidden Mystery";

      return res.json({ success: true, accessToken, user });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

module.exports = { handleLogin };
