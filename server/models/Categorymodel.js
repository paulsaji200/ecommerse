// models/productModel.js
import mongoose from 'mongoose';
import { type } from 'os';

const categorySchema = new mongoose.Schema({
 
name:{
  type:String,
  required:true
},
listed:{
  type:Boolean,
  required:true
},
deleted:{
  type:Boolean,
  default:false
}

}, 
{
  timestamps: true, // Add timestamps to track createdAt and updatedAt
});

const Category = mongoose.model('CategoryList', categorySchema);

export default Category;
