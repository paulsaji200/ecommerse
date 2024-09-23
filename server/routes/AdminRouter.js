import express from "express"
import adminLogin, { admintokenVerify } from "../controller/admin/Admincontroller.js";
import addproduct, { addcategory, deletecategory, deleteProduct, editCategory, editProduct, getcategories, geteditproduct, getproductAdmin, unDeleteProduct, viewcustomer } from "../controller/admin/productAdmin.js";
import { userstatus } from "../controller/admin/userManagement.js";
import { getOrders } from "../controller/admin/orderAdmin.js";

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
export default adminRouter