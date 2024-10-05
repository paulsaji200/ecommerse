import express, { response } from "express";
import cors from "cors";
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import connectDb from "./config/connectdb.js"; // Ensure this connects to your MongoDB
import User from "./models/userModel.js";      // Import your User model
import userRouter from "./routes/UserRouter.js";
import nodemailer from 'nodemailer';
import adminRouter from "./routes/AdminRouter.js";
import {google} from "googleapis"
import axios from "axios"
import { generateToken } from "./utils/generateToken.js";
const app = express();
const PORT = process.env.PORT || 5000;
import cookieParser from "cookie-parser";
import crypto from "crypto"
import dotenv from 'dotenv';
import Order from "./models/order.js";
import Razorpay from 'razorpay';

dotenv.config();

// Middleware   
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
console.log(GOOGLE_CLIENT_SECRET,'ujjcgcgf')

app.use(cookieParser());
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});


app.use(express.json());


connectDb(); // Connect to the database


const oauth2client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'postmessage'
  
  
  
  )



  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'paulsaji201@gmail.com',
      pass: 'jrtlewsenpjmizvi'
    }
  });
  
 
  const otpDatabase = {};
  

  app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
  
   
    const otp = crypto.randomInt(100000, 999999).toString();
    otpDatabase[email] = otp;
  
    
    const mailOptions = {
      from: '"Your Name" <paulsaji201@gmail.com>',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
      html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Failed to send OTP', error });
    }
  });
  
 
  app.post('/api/verify-otp', (req, res) => {
    console.log("otp....")
    console.log(otpDatabase)
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
  
    if (otpDatabase[email] === otp) {
      delete otpDatabase[email]; 
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid OTP' });
    }
  });




app.get("/api/google", async (req, res) => {
  console.log("Google OAuth process started...");
  try {
    const { code } = req.query;

    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

  
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`);
    console.log(userRes.data);

    const { email, name } = userRes.data;

    
    let user1 = await User.findOne({ email });
    if (!user1) {
   
      user1 = await User.create({
        email,
        name
      });

      const { _id, name: userName } = user1;
      
      // Generate token
      generateToken(res, { _id, name: userName });

    } else {
      const { _id, name: userName } = user1;
     
      generateToken(res, { _id, name: userName });
    }   

    res.status(200).json({ message: 'Google OAuth successful', user: { _id: user1._id, name: user1.name, email: user1.email } });
    
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ message: 'OAuth error', error });
  }
});
app.get('/api/admintoken-verify', (req, res) => {
  console.log("verify.....")
  const token = req.cookies.token;
  
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secretKey');
    console.log(decoded)
    if (decoded.isadmin ) {
      res.json({ valid: true });
    } else {
      res.status(403).json({ valid: false, message: 'Not an admin' });
    }
  } catch (error) {
    res.status(400).json({ valid: false, message: 'Invalid token' });
  }
});



const razorpay = new Razorpay({
  key_id: 'rzp_test_homhAZdqfLrL9E', // Remove leading spaces
  key_secret: 'cLeCN0YNzzNonfCUw12LPTtW', // Remove leading spaces
});

app.post('/verify-payment', async (req, res) => {
  console.log("kkk")
  console.log(req.body);
  const { razorpay_payment_id, amount ,orderId} = req.body; // Ensure amount is passed in the request
  console.log(razorpay_payment_id,amount,orderId);

  try {
    const response = await razorpay.payments.fetch(razorpay_payment_id);

    if (response.status === 'captured') {
      console.log("Payment verified successfully.");
      res.json({ success: true });
    } else if (response.status === 'authorized') {
      // Capture the payment if it's authorized
      console.log("authorized")
      const captureResponse = await razorpay.payments.capture(razorpay_payment_id, amount);
      console.log('Payment captured:', captureResponse);
       await Order.findByIdAndUpdate(orderId,{paymentStatus:"paid"})

      res.json({ success: true });
    } else {
      console.log("Payment not captured.");
      res.json({ success: false });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.json({ success: false });
  }
});

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
