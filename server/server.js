import express, { response } from "express";
import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";
import connectDb from "./config/connectdb.js"; // Ensure this connects to your MongoDB
import User from "./models/userModel.js"; // Import your User model
import userRouter from "./routes/UserRouter.js";
import nodemailer from "nodemailer";
import adminRouter from "./routes/AdminRouter.js";
import { google } from "googleapis";
import axios from "axios";
import { generateToken } from "./utils/generateToken.js";
const app = express();
const PORT = process.env.PORT || 5000;
import cookieParser from "cookie-parser";
import crypto from "crypto";
import dotenv from "dotenv";
import Order from "./models/order.js";
import Razorpay from "razorpay";

dotenv.config();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

app.use(express.json())
connectDb(); // Connect to the database
// const razorpay = new Razorpay({
//   key_id: "rzp_test_homhAZdqfLrL9E", // Remove leading spaces
//   key_secret: "cLeCN0YNzzNonfCUw12LPTtW", // Remove leading spaces
// });

// app.post("/verify-payment", async (req, res) => {
//   console.log("kkk");
//   console.log(req.body);
//   const { razorpay_payment_id, amount, orderId } = req.body; // Ensure amount is passed in the request
//   console.log(razorpay_payment_id, amount, orderId);

//   try {
//     const response = await razorpay.payments.fetch(razorpay_payment_id);

//     if (response.status === "captured") {
//       console.log("Payment verified successfully.");
//       res.json({ success: true });
//     } else if (response.status === "authorized") {
//       // Capture the payment if it's authorized
//       console.log("authorized");
//       const captureResponse = await razorpay.payments.capture(
//         razorpay_payment_id,
//         amount
//       );
//       console.log("Payment captured:", captureResponse);
//       await Order.findByIdAndUpdate(orderId, { paymentStatus: "Paid" });

//       res.json({ success: true });
//     } else {
//       console.log("Payment not captured.");
//       res.json({ success: false });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error);
//     res.json({ success: false });
//   }
// });
console.log("helooooo")

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
