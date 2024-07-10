const User = require("../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd, email, phoneNo } = req.body;
  if (!user || !pwd || !email || !phoneNo) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // check for duplicate usernames in the db
  const duplicate = User.findOne({ email: email }).exec();
  if (duplicate) {
    return res.sendStatus(409); //Conflict
  }
  if (!duplicate) {
    const hashedPwd = bcrypt.hash(pwd, 10);
    // create jwts
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: user,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "2d" }
    );
    const refreshToken = jwt.sign(
      { username: user },
      process.env.REFRESH_TOKEN_SECRETE,
      { expireIn: "2d" }
    );
    // User.create: create and stores new user in db
    const result = User.create({
      username: user,
      email: email,
      paswword: hashedPwd,
      phoneNo: phoneNo,
      refreshToken: refreshToken,
    });
    res.status(201).json({ success: `New user ${user} created!` });
    //Since it is not secure to save refresh token in local storage so we are saving it as a cookie and as http only because http is not available to javascript
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 48 * 60 * 60 * 1000,
    });
    return res.json({ accessToken });
  } else {
    res.sendStatus(500);
  }
};

module.exports = { handleNewUser };
