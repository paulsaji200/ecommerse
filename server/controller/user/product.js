import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/Cart.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Address from "../../models/addressMode.js"
import Order from "../../models/order.js";

const getproduct = async (req, res) => {
  console.log('Product model:', mongoose.models['Product']);
  try {
    const data = await Product.find({deleted:false});
     
    res.status(201).send({ data });
  } catch (error) {
    console.error('Error occurred while fetching products:', error);
    res.status(500).send({ error: 'An error occurred while fetching products' });
  }
};
export const productdetails = async(req,res)=>{
const {id} = req.params
console.log(id)
      const data =  await Product.findById(id)

      res.status(201).send({data:data})
    }


    export const serachProduct = async (req, res) => {
        try {
            const searchQuery = req.query.query; 
            const regex = new RegExp(searchQuery, 'i'); 
            
            
            const products = await Product.find({
                $or: [
                    { productName: regex },
                    { description: regex },
                    { category: regex },
                   
                ]
            });
    
            if (products.length === 0) {
                return res.status(404).json({ message: 'No products found' });
            }
    
            res.status(200).json(products);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    };
    
    
    






    


export default getproduct
