const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/userModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer"); // Import nodemailer
const { VerifyTokenModel } = require("../models/verifyToken");
const mongoose = require("mongoose");
const userRoutes = express.Router();

userRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).send({ msg: "User already exists" });
    } else {
      if (validatePassword(password)) {
        const hash = await bcrypt.hash(password, 2);

        const data = new UserModel({ name, email, password: hash });
        await data.save();

        // Send verification email
        const transporter = nodemailer.createTransport({
          host: process.env.HOST,
          port: process.env.NODEMAILER_PORT,
          secure: false,
          auth: {
            user: "kkalyan2312@gmail.com",
            pass: process.env.PASSWORD,
          },
        });

        const token = crypto.randomBytes(20).toString("hex");
        const verifyTokenData = new VerifyTokenModel({
          userId: data._id,
          verifyToken: token,
        });
        await verifyTokenData.save();

        const mailOptions = {
          from: "kkalyan2312@gmail.com",
          to: data.email,
          subject: "Verify your email",
          text: `Verify with the Token: ${token}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        res.status(200).send({ msg: "User Signup successfully" });
      } else {
        res.status(400).send({
          msg: "Password must meet the following criteria:",
          requirements: {
            length: "At least 8 characters",
            uppercase: "At least one uppercase letter (A-Z)",
            digit: "At least one digit (0-9)",
            specialCharacter:
              "At least one special character (!@#$%^&*()_+{}[]:;<>,.?~)",
          },
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

userRoutes.get("/verify", async (req, res) => {
  const { verifyToken } = req.query;

  try {
    const user = await VerifyTokenModel.findOne(verifyToken);

    if (!user) {
      return res
        .status(404)
        .send({ msg: "User not found or verification token is invalid" });
    } else {
      // Remove the verification token from the database
      await VerifyTokenModel.findOneAndDelete(user._id);

      res.status(200).send({ msg: "Verification successful" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

function validatePassword(password) {
  const pattern =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])(?=.{8,})/;
  return pattern.test(password);
}

module.exports = { userRoutes };
