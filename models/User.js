const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
    image: {
      type: String,
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
      enum: ["user", "admin"], // enum is used to store constant values other than those nothing is accepted
    },

    refreshToken: String,
    favourites: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
