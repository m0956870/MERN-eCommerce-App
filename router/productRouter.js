const express = require("express");
const router = express.Router();

const User = require("../model/userSchema");
const Product = require("../model/productSchema");

const verifyUser = require("../middleware/jwtAuth");

// POST
router.get("/allproducts", async (req, res) => {
  try {
    const allPosts = await Product.find().sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: allPosts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/find/:_id", async (req, res) => {
  try {
    let post = await Product.findOne({ _id: req.params._id });
    res.status(200).json({ status: true, response: post });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.post("/upload", async (req, res) => {
  // console.log(req.body);
  try {
    const product = await Product.create(req.body);
    res
      .status(200)
      .json({ status: true, response: "Success: Product created." });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.post("/edit", async (req, res) => {
  // console.log(req.body);
  try {
    const product = await Product.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    res.status(200).json({
      status: true,
      response: "Success: Product edited successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/allproducts/:_id", async (req, res) => {
  try {
    const myPosts = await Product.find({ postedBy: req.params._id });
    res.status(200).json({ status: true, response: myPosts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/allproducts/newest/:_id", async (req, res) => {
  try {
    const myPosts = await Product.find({ postedBy: req.params._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: myPosts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/myproducts", verifyUser, async (req, res) => {
  try {
    const myPosts = await Product.find({ postedBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: myPosts });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/category/:category", async (req, res) => {
  // console.log(req.params.category)
  try {
    let post = await Product.find({ category: req.params.category });
    res.status(200).json({ status: true, response: post });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/category/newest/:category", async (req, res) => {
  // console.log(req.params.category)
  try {
    let post = await Product.find({ category: req.params.category }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: post });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

// DELETE product
router.get("/delete/:_id", verifyUser, async (req, res) => {
  // console.log(req.params._id);
  try {
    let post = await Product.findByIdAndDelete(req.params._id);
    res.status(200).json({
      status: true,
      response: "Success: Product deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/delete-all", verifyUser, async (req, res) => {
  // console.log(req.params._id);
  try {
    await Product.deleteMany();
    res.status(200).json({
      status: true,
      response: "Success: All products deleted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

module.exports = router;
