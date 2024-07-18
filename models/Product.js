const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    require: true,
    enum: ["Fashion", "Electronics", "Furniture", "Others"],
  },
  image: {
    type: String,
    require: true,
  },
  isFeatured: {
    type: Boolean,
    require: true,
  },
  bidEndTime: {
    type: Date,
    require: true,
  },
});
