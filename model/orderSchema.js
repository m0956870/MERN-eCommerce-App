const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    items: {
      type: Object,
    },
    customerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerDetails: {
      type: Object,
    },
    total: {
      type: Number,
    },
    paymentType: {
      type: String,
    },
    status: {
      type: String,
      default: "Order placed",
    },
    date: {
      type: String,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
