const express = require("express");
const router = express.Router();

const Order = require("../model/orderSchema");

const verifyUser = require("../middleware/jwtAuth");

// ADMIN
router.get("/allorders", async (req, res) => {
  try {
    let allOrders = await Order.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: allOrders });
  } catch (error) {
    res.status(400).json({ status: false, response: error });
  }
});


// CUSTOMER
router.get("/my-orders", verifyUser, async (req, res) => {
  try {
    let myOrders = await Order.find({ customerID: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: myOrders });
  } catch (error) {
    res.status(400).json({ status: false, response: error });
  }
});

router.post("/place", async (req, res) => {
  try {
    let orderItem = await Order.create(req.body);
    res
      .status(200)
      .json({ status: true, response: "Success: Order placed successfully." });
  } catch (error) {
    res.status(400).json({ status: false, response: error });
  }
});

router.post("/cancel", verifyUser, async (req, res) => {
  // console.log(req.body._id);
  try {
    let orderItem = await Order.findByIdAndUpdate(
      req.body._id,
      {
        $set: { status: "Canceled" },
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      response: "Success: Order canceled successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/delete/:_id", verifyUser, async (req, res) => {
  // console.log(req.params._id);
  try {
    let orderItem = await Order.findByIdAndDelete(req.params._id);
    res.status(200).json({
      status: true,
      response: "Success: Order deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/delete-all", verifyUser, async (req, res) => {
  // console.log(req.params._id);
  try {
    await Order.deleteMany();
    res.status(200).json({
      status: true,
      response: "Success: All orders deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

module.exports = router;
