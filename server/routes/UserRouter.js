
import express from "express"
import userRegister, { addAddress, deleteAddress, editAddress, forgetpassword, getAddress, googleReg, Login, resetpassword, sendOtp, userProfile, verifyOtp, verifyUser } from "../controller/user/Usercontroller.js";
import getproduct, { filter, filterProduct, productdetails, search, serachProduct } from "../controller/user/product.js";
import createOrder, { addToCart, cartupdate, clearCart, deleteCart, getCart,getOrder } from "../controller/user/order.js";
import userAuth from "../middlewares/isuserAuth.js";




const userRouter = express.Router();

userRouter.post("/register",userRegister)
userRouter.post("/login",Login)
userRouter.get("/getproduct",getproduct)
userRouter.get("/productdetails/:id",productdetails)

userRouter.get("/verifyuser",userAuth,verifyUser)
userRouter.post("/addtocart",userAuth,addToCart)
userRouter.get("/getcart",userAuth,getCart)
userRouter.post("/addaddress",userAuth,addAddress)
userRouter.get("/getaddress",userAuth,getAddress)
userRouter.post("/createorder",userAuth,createOrder)
userRouter.get("/google",googleReg)
userRouter.post("/verify-otp",verifyOtp)
userRouter.post("/send-otp",sendOtp)
userRouter.post("/forgetpassword",forgetpassword)
userRouter.post("/resetpassword",resetpassword)
userRouter.patch("/cartupdate/:product_id",userAuth, cartupdate);
userRouter.delete("/deletecart/:product_id",userAuth,deleteCart)
userRouter.delete("/deleteaddress/:id",userAuth,deleteAddress)
userRouter.get("/products/search",serachProduct)
userRouter.get("/getorder",userAuth,getOrder)
userRouter.get("/profile",userAuth,userProfile)
userRouter.delete("/clearcart",userAuth,clearCart)
userRouter.patch("/updateaddress/:id",userAuth,editAddress)
userRouter.patch("/cancerorder",userAuth,userCancelOrder)

userRouter.get("/search",search)
userRouter.get("/filter",filter)
export default userRouter  