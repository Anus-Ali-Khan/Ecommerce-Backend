const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  phoneNo: {
    type: String,
    require: true,
  },
  roles: {
    User: {
      type: String,
      default: "user",
    },
    Admin: {
      type: String,
    },
  },
  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
