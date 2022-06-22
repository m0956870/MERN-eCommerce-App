const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();
const PORT = process.env.PORT;

const cors = require("cors");

// connect DB
require("./db/conn");

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// router
app.use("/user", require("./router/userRouter"));
app.use("/product", require("./router/productRouter"));
app.use("/order", require("./router/orderRouter"));

app.get("/", (req, res) => {
  res.send("Server Home Page");
});

app.get("/logout", (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ status: true, response: "logout successfull" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, response: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
