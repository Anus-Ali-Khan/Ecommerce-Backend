const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied", success: false });
  }

  //jwt.verify function returns the decoded token
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // check user in dataabase for security purpose
    let existingUser = await User.findById(decoded.userInfo.id);
    if (!existingUser) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    // set user object in req
    req.user = existingUser;

    next();
  } catch (err) {
    console.log("Error:", err.message);
    res.status(403).json({ message: "Invalid token", success: false });
  }
};
