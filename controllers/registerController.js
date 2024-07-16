const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleNewUser = async (req, res) => {
  const { user, pwd, email, phoneNo } = req.body;
  if (!user || !pwd || !email || !phoneNo) {
    return res.status(400).json({ message: "Please provide all fields." });
  }

  try {
    // check for duplicate email and phoneNo in the db
    const duplicateEmail = await User.findOne({ email: email }).exec();
    if (duplicateEmail) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exist." }); //Conflict
    }
    const duplicateNo = await User.findOne({ phoneNo: phoneNo }).exec();
    if (duplicateNo) {
      return res
        .status(409)
        .json({ success: false, message: "Phone number already exists." });
    }
    // Hashed Password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // User.create: create and stores new user in db
    const newUser = await User.create({
      username: user,
      email: email,
      password: hashedPwd,
      phoneNo: phoneNo,
    });
    // create jwts
    const accessToken = jwt.sign(
      {
        userInfo: {
          email: newUser.email,
          id: newUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { username: newUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "2d" }
    );
    newUser.refreshToken = refreshToken;
    await newUser.save();
    res.status(201).json({
      success: true,
      message: `New user ${user} created!`,
      newUser,
      accessToken,
    });
    //Since it is not secure to save refresh token in local storage so we are saving it as a cookie and as http only because http is not available to javascript
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 48 * 60 * 60 * 1000,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: err.message,
    });
  }
};

module.exports = { handleNewUser };
