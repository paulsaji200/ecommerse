import express from "express"
import adminLogin, { admintokenVerify } from "../controller/admin/Admincontroller.js";
import addproduct, { addcategory, deletecategory, deleteImageProduct, deleteProduct, editCategory, editProduct, getcategories, geteditproduct, getproductAdmin, unDeleteProduct, viewcustomer } from "../controller/admin/productAdmin.js";
import { userstatus } from "../controller/admin/userManagement.js";
import { createCoupon, deleteCoupon, editOrderStatus, getCoupen, getOrders, orderdetails } from "../controller/admin/orderAdmin.js";
import { updateOrderStatus } from "../controller/admin/orderAdmin.js";
const adminRouter = express.Router();

adminRouter.post("/login",adminLogin)
adminRouter.post("/addproduct",addproduct)
adminRouter.post("/addcategory",addcategory)
adminRouter.delete('/deletecategory/:id',deletecategory)
adminRouter.get("/getcategories",getcategories)
adminRouter.put("/updatecategory/:id",editCategory)
adminRouter.get("/viewcustomer",viewcustomer)
adminRouter.put("/userstatus/:id",userstatus)
adminRouter.get("/getproducts",getproductAdmin)
adminRouter.get("/geteditproduct/:id",geteditproduct)
adminRouter.put("/updateproduct/:id",editProduct)
adminRouter.delete("/deleteproduct/:id",deleteProduct)
adminRouter.patch("/undeleteproduct/:id",unDeleteProduct)
adminRouter.get("/getorders",getOrders)
adminRouter.get("/admintoken-verify",admintokenVerify)
adminRouter.get("/orders/:id",orderdetails)
adminRouter.put('/updateorders/:orderId/:productId', updateOrderStatus);
adminRouter.patch('/orders/:orderId',editOrderStatus)
adminRouter.get("/getCoupon",getCoupen)
adminRouter.post("/createcoupon",createCoupon)
adminRouter.delete("/deleteCoupon",deleteCoupon)
adminRouter.delete("/deleteimageproduct",deleteImageProduct)

export default adminRouter