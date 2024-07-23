const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bidSchema = new Schema(
  {
    bidAmounts: [
      {
        price: { type: String, require: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", require: true },
      },
    ],
    startTime: {
      type: Date,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bid", bidSchema);
