const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
    },
    subCategory: {
      type: String,
    },
    stock: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
    },
    image: {
      type: String,
    },
    date: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
