const jwt = require("jsonwebtoken");
const express = require("express");

const User = require("../model/userSchema");

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    // console.log(token);

    const verified = await jwt.verify(token, process.env.SECRET_KEY);
    // console.log(verified) // return {id:"", iat:""}

    const user = await User.findOne({ _id: verified.id });

    if (!user) {
     return res.status(400).json({ status: false, response: "User not found" });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log(err);
    return res.status(400).json({ status: false, response: "JWT token not found" });
  }
};

module.exports = verifyUser;
