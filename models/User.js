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
  // roles: {
  //   User: {
  //     type: String,
  //     default: "user",
  //   },
  //   Admin: {
  //     type: String,
  //   },
  // },
  roles: {
    type: [String],
    default: ["user"],
    enum: ["user", "admin"],
  },

  refreshToken: String,
});

module.exports = mongoose.model("User", userSchema);
