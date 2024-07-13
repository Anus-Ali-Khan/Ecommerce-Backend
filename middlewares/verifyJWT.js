const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied", success: false });
  }

  //jwt.verify function returns the decoded token
  try {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ success: false, message: "Invalid token" });
      }
      // set user object in req
      req.email = decoded.userInfo.email;
      next();
    });
  } catch (err) {
    console.log("Error:", err.message);
    res.status(403).json({ message: "Invalid token", success: false });
  }
};
