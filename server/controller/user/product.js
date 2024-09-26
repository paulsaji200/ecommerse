import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/Cart.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Address from "../../models/addressMode.js";
import Order from "../../models/order.js";

const getproduct = async (req, res) => {
  console.log("Product model:", mongoose.models["Product"]);
  try {
    const data = await Product.find({ deleted: false });

    res.status(201).send({ data });
  } catch (error) {
    console.error("Error occurred while fetching products:", error);
    res
      .status(500)
      .send({ error: "An error occurred while fetching products" });
  }
};
export const productdetails = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const data = await Product.findById(id);

  res.status(201).send({ data: data });
};

export const serachProduct = async (req, res) => {
  try {
    const searchQuery = req.query.query;
    const regex = new RegExp(searchQuery, "i");

    const products = await Product.find({
      $or: [
        { productName: regex },
        { description: regex },
        { category: regex },
      ],
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const filterProduct = async (req, res) => {
  console.log("filter");
  try {
    const {
      price,
      category,
      brand,
      rating,
      newArrivals,
      popularity,
      featured,
    } = req.query;

    let query = { deleted: false };

    if (price) {
      const [minPrice, maxPrice] = price.split(",").map(Number);
      query["$or"] = [
        { productPrice: { $gte: minPrice, $lte: maxPrice } },
        { salePrice: { $gte: minPrice, $lte: maxPrice } },
      ];
    }

    if (category) {
      const categoryArray = category.split(",");
      query.category = { $in: categoryArray };
    }

    if (brand) {
      const brandArray = brand.split(",");
      query.brandName = { $in: brandArray };
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (newArrivals === "true") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      query.createdAt = { $gte: thirtyDaysAgo };
    }

    if (popularity === "true") {
    }

    if (featured === "true") {
      query.featured = true;
    }

    const products = await Product.find(query);

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
export const search = async (req, res) => {
  console.log("1");
  const query = req.query.query || "";
  console.log("Search Query:", query);

  try {
    let products;

    if (query) {
      products = await Product.find({
        $or: [
          { productName: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      products = await Product.find();
    }

    res.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};
export const filter = async (req, res) => {
  console.log("Filtering products...");

  const {
    query,
    price,
    category,
    brand,
    rating,

    sortBy,
    sortOrder,
  } = req.query;

  console.log(price, category);
  const filters = {};

  if (query) {
    filters.$or = [
      { productName: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (price) {
    try {
      const priceRange = JSON.parse(price);

      filters.salePrice = {
        $gte: priceRange.min || 0,
        $lte: priceRange.max || Infinity,
      };
    } catch (error) {
      console.error("Invalid price format:", error);
      return res.status(400).json({ message: "Invalid price format" });
    }
  }

  if (category) {
    filters.category = { $in: Array.isArray(category) ? category : [category] };
  }

  console.log("Filters applied:", filters);

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  try {
    const products = await Product.find(filters).sort(sort);
    console.log("Filtered products:", { products });

    if (products.length === 0) {
      console.log("No products found with the applied filters.");
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({ data: { products } });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error });
  }
};

export default getproduct;
