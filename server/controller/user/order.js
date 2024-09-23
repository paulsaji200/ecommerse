import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/Cart.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Address from "../../models/addressMode.js"
import Order from "../../models/order.js";
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user info is available through middleware
    const { productData } = req.body;
    const productId = productData._id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Fetch the product details from the database
    const product = await Product.findById(productId);
    console.log(product)
    console.log(product.salePrice)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart, or create a new one if it doesn't exist
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProduct = cart.products.find(p => p.productId.toString() === productId.toString());

    if (existingProduct) {
      // Increment quantity if the product is already in the cart
      existingProduct.quantity += 1;
    } else {
      // Add new product to the cart with required fields (name, price, and quantity)
      cart.products.push({
        productId: product._id,
        name: product.productName, // Ensure product name exists
        price: product.salePrice,  // Ensure product price exists
        quantity: 1
      });
    }

    cart.totalPrice = cart.products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
   
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



export const getCart = async (req, res) => {
  try {
    console.log('Product model:', mongoose.models['Product']);
    console.log('Fetching cart...');
    const userId = req.user.id;
    console.log('User ID:', userId);

    const cart = await Cart.findOne({ userId });
    console.log(cart)
    //  cart = await Cart.findOne({ userId }).populate('products.productId');

    await cart.populate('products.productId');
    console.log('Cart:', cart);

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




 


    export const cartupdate = async (req, res) => {
      console.log('Cart update route hit');
      
      const { product_id } = req.params; // Extract product ID from URL params
      const { quantity } = req.body; // Extract quantity from the request body
      
      try {
        console.log('Product ID:', product_id);
        console.log('New Quantity:', quantity);
    
        // Validate quantity
        if (!quantity || quantity < 1) {
          return res.status(400).json({ message: 'Invalid quantity' });
        }
        const trimmedProductId = product_id.trim()
    
        const userId = req.user.id; 
          

        const updatedCart = await Cart.findOneAndUpdate(
          { userId, 'products.productId': trimmedProductId  }, // Find the cart with the specified product ID
          { $set: { 'products.$.quantity': quantity } }, // Update the quantity
          { new: true } 
        );
    
        // Check if the cart and product were found and updated
        if (!updatedCart) {
          return res.status(404).json({ message: 'Cart or product not found' });
        }
    
        return res.status(200).json({ message: 'Quantity updated successfully', cart: updatedCart });
      } catch (error) {
        console.error('Error updating cart:', error);
        return res.status(500).json({ message: 'Failed to update quantity', error });
      }
    };
    

    export const deleteCart = async (req, res) => {
      const { product_id } = req.params; // Get product ID from URL params
      const u_id = req.user.id; // Assuming user ID is coming from authenticated user
    
      try {
        // Find the cart of the logged-in user and remove the product with the specified ID
        const updatedCart = await Cart.findOneAndUpdate(
          { userId: u_id }, // Find the cart of the logged-in user
          { $pull: { products: { productId: product_id } } }, // Remove the product from the cart
          { new: true } // Return the updated cart
        );
    
        if (!updatedCart) {
          return res.status(404).json({ message: 'Cart or product not found' });
        }
    
        return res.status(200).json({ message: 'Product removed from cart successfully', cart: updatedCart });
      } catch (error) {
        console.error('Error deleting product from cart:', error);
        return res.status(500).json({ message: 'Failed to delete product from cart', error });
      }
    };
    

    const createOrder = async (req, res) => {
      const userId = req.user.id;
     
      const {orderData} = req.body;
      const address = orderData.address;
      console.log(orderData)

         console.log(orderData)
      try {
        
       
           const products  = orderData.products;
        if (!products || !Array.isArray(products) || products.length === 0) {
          return res.status(400).json({ error: 'No products provided' });
        }
    
        const newOrder = new Order({
          user: userId,
          products: products.map(product => ({
            productId: product.productId,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            status: 'Ordered',
          })),
          totalPrice: orderData.totalPrice,
          shippingAddress: {
            street: address.street,
            city: address.city,
            postalCode: address.postalCode,
            country: address.country,
          },
          paymentMethod: orderData.paymentMethod,
          paymentStatus: 'Pending',
          orderStatus: 'Processing',
        });
    
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
      }
    };



   export  const getOrder = async (req, res) => {
      try {
        const userId = req.user.id; // Assuming user ID is extracted from JWT or session
        const orders = await Order.find({ user: userId });
    
        if (!orders || orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this user.' });
        }
    
        // Return the found orders with detailed information
        res.status(200).json(orders)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
      }
    };
    
export default createOrder    