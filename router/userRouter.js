const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/userSchema");

const verifyUser = require("../middleware/jwtAuth");

const nodemailer = require("nodemailer");
const { default: mongoose } = require("mongoose");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

const secretKey = process.env.STRIPE_SECRET_KEY;

const stripe = require("stripe")(secretKey);

router.post("/payment", async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.email,
      source: req.body.id,
    });

    const charge = await stripe.charges.create({
      amount: 100 * 100,
      description: "eCommerce product",
      currency: "USD",
      customer: customer.id,
    });

    res.send(charge);
  } catch (error) {
    console.log(error);
  }
});

// USER Routes
router.get("/allusers", async (req, res) => {
  try {
    const allUsers = await User.find().sort({createdAt: -1});
    res.status(200).json({ status: true, response: allUsers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/details", verifyUser, async (req, res) => {
  try {
    res.status(200).json({ status: true, response: req.user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const user = await User.find({ _id: req.params.id });
    res.status(200).json({ status: true, response: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/search/:value", async (req, res) => {
  // console.log(req.params.search);
  try {
    let users = await User.find({
      $or: [
        {
          name: { $regex: new RegExp(req.params.value) },
        },
        {
          email: { $regex: new RegExp(req.params.value) },
        },
      ],
    });

    res.status(200).json({ status: true, response: users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

// GOOGLE LOGIN
router.post("/login/google", async (req, res) => {
  // console.log(req.body);

  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      // console.log(token);

      const cookie = res.cookie("jwt", token, {
        maxAge: new Date(new Date().getTime() + 60 * 60 * 24 * 30), // date.now()+60*60*24*30 // for month
        httpOnly: true,
      });

      res
        .status(200)
        .json({ status: true, response: "Success: User Login successfully" }); // header in small letters
    } else {
      await User.create(req.body);

      const user = await User.findOne({ email: req.body.email });

      if (user) {
        const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY);
        // console.log(token);

        const cookie = res.cookie("jwt", token, {
          maxAge: new Date(new Date().getTime() + 60 * 60 * 24 * 30), // date.now()+60*60*24*30 // for month
          httpOnly: true,
        });

        // transporter.sendMail(
        //   {
        //     from: "no-reply@gmail.com",
        //     to: user.email,
        //     subject: "Greeting from CRUD App.",
        //     html: `<p>Welcome to CRUD App. I hope you will have a nice experience with us.</p>`,
        //   },
        //   (err, info) => {
        //     if (err) {
        //       return console.log(err);
        //     }
        //   }
        // );

        res.status(200).json({
          status: true,
          response: "Success: User Login successfully",
        });
      } else {
        res
          .status(400)
          .json({ status: false, response: "Error: User not found" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: false,
      response: "Error: Server error! Try again later.",
    });
  }
});

// SIGNUP & LOGIN Routes
router.post("/signup", async (req, res) => {
  const { name, email, password, date, role } = req.body;

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      // console.log("user exist");
      return res
        .status(400)
        .json({ status: false, response: "Error: User already exist" });
    } else {
      let hashPass = await bcrypt.hash(password, 10);

      const newUser = await new User({
        name,
        email,
        password: hashPass,
        date,
        role: role,
      });

      const result = await newUser.save();
      // console.log(result);
      res
        .status(200)
        .json({ status: true, response: "Success: User signup successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false, response: error });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    
    if(user.blocked === true){
      return res
        .status(400)
        .json({ status: false, response: "Error: User is blocked by admin." });
    }

    if (user) {
      const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      // console.log(token);

      const cookie = res.cookie("jwt", token, {
        maxAge: new Date(new Date().getTime() + 60 * 60 * 24 * 30), // date.now()+60*60*24*30 // for month
        httpOnly: true,
      });

      let hashPass = await bcrypt.compare(password, user.password);

      if (user.email === email && hashPass) {
        res
          .status(200)
          .json({ status: true, response: "Success: User Login successfully" }); // header in small letters
      } else {
        res
          .status(400)
          .json({ status: false, response: "Error: Invalid credentials" });
      }
    } else {
      return res
        .status(400)
        .json({ status: false, response: "Error: User not found" }); // send res.json so client can receive and show res in console
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: false, response: error });
  }
});

// UPDATE details
router.post("/update/profilepic", async (req, res) => {
  // console.log(req.body);
  let { _id, profilePic } = req.body;
  try {
    let updateUser = await User.updateOne({ _id }, { $set: { profilePic } });
    let user = await User.findOne({ _id });
    res.status(200).json({ status: true, response: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.post("/update/account-details", async (req, res) => {
  // console.log(req.body);
  let { _id } = req.body;
  try {
    let updateUser = await User.updateOne({ _id }, { $set: req.body });
    let user = await User.findOne({ _id });
    res.status(200).json({ status: true, response: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.put("/update/addtocart", verifyUser, async (req, res) => {
  // console.log(req.body);
  try {
    let updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $push: { cartItems: req.body },
      },
      { new: true }
    );

    res.status(200).json({ status: true, response: updateUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.put("/update/updatecart", verifyUser, async (req, res) => {
  // console.log(req.body);

  try {
    let updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          cartItems: req.user.cartItems.find(
            (item) => item._id === req.body._id
          ),
        },
      },
      { new: true }
    );

    res.status(200).json({ status: true, response: updateUser });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

// router.put("/update/updatecart", verifyUser, async (req, res) => {
//   // console.log(req.body);
//   try {
//     let updateUser = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         $pull:  {cartItems: req.body}
//       },
//       { new: true }
//     );

//     res.status(200).json({ status: true, response: updateUser });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ status: false, response: error });
//   }
// });

router.post("/update/password", async (req, res) => {
  // console.log(req.body);
  let { _id, password } = req.body;
  try {
    let hashPass = await bcrypt.hash(password, 10);
    let updateUser = await User.updateOne(
      { _id },
      { $set: { password: hashPass } }
    );
    res.status(200).json({
      status: true,
      response: "Success: Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

// Password Routes
router.post("/password/forget", async (req, res) => {
  // console.log(req.body);
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ status: false, response: "Error: User Not Found!" });
    }

    const token = await jwt.sign({ id: user._id }, process.env.SECRET_KEY);

    const cookie = res.cookie("resetPassword", token, {
      maxAge: Date.now() + 60 * 10,
      httpOnly: true,
    });

    // transporter.sendMail(
    //   {
    //     from: "no-reply@gmail.com",
    //     to: user.email,
    //     subject: "Change Password",
    //     html: `<a href="http://localhost:3000/password/reset">Reset password</a>`,
    //   },
    //   (err, info) => {
    //     if (err) {
    //       return console.log(err);
    //     }
    //   }
    // );
    res
      .status(200)
      .json({ status: true, response: "Success: Check your email!" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.post("/password/reset", async (req, res) => {
  // console.log(req.body);
  try {
    let token = req.cookies.resetPassword;
    if (!token) {
      return res
        .status(400)
        .json({ status: false, response: "Error: Link expired!" });
    }
    let verified = await jwt.verify(token, process.env.SECRET_KEY);

    let verifiedUser = await User.findOne({ _id: verified.id });

    let hashPass = await bcrypt.hash(req.body.password, 10);

    let user = await User.updateOne(
      { _id: verifiedUser._id },
      { $set: { password: hashPass } }
    );

    res.status(200).json({
      status: true,
      response: "Success: Password updated successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/seller", async (req, res) => {
  try {
    const allUsers = await User.find({ role: "seller" }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: true, response: allUsers });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/block/:_id", verifyUser, async (req, res) => {
  // console.log(req.params._id);
  try {
    let user = await User.findByIdAndUpdate(
      req.params._id,
      {
        $set: { blocked: true },
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      response: "Success: User blocked successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/unblock/:_id", verifyUser, async (req, res) => {
  // console.log(req.params._id);
  try {
    let user = await User.findByIdAndUpdate(
      req.params._id,
      {
        $set: { blocked: false },
      },
      { new: true }
    );
    res.status(200).json({
      status: true,
      response: "Success: User unblock successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});


router.post("/delete", async (req, res) => {
  // console.log(req.body);
  let { _id } = req.body;
  try {
    let user = await User.deleteOne({ _id });
    res
      .status(200)
      .json({ status: true, response: "Success: User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

router.get("/delete/:_id", async (req, res) => {
  try {
    let user = await User.deleteOne({ _id: req.params._id });
    res
      .status(200)
      .json({ status: true, response: "Success: User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

module.exports = router;
