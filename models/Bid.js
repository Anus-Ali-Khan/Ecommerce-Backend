const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema(
  {
    bidAmounts: [
      { price: String, userId: Schema.Types.ObjectId, require: true },
    ],
    startTime: {
      type: Date.now(),
      require: true,
    },
    endTime: {
      type: Date,
      require: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      require: true,
    },
    userId: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
