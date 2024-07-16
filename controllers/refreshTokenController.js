const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res
      .status(401)
      .json({ message: "No token,authorization denied.", success: "false" });
  }
  try {
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
      return res.status(403).json({ message: "Invalid Token", success: false });
    }
    //evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || foundUser.email !== decoded.email) {
          return res.sendStatus(403);
        }
        // creating new access Token after verifying refresh token
        const accessToken = jwt.sign(
          {
            userInfo: {
              email: decoded.email,
              id: decoded.id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        res.json({ success: true, accessToken, foundUser });
      }
    );
  } catch (err) {
    console.log("Error:", err.message);
    res.status(403).json({ message: "Invalid token", success: false });
  }
};

module.exports = { handleRefreshToken };
