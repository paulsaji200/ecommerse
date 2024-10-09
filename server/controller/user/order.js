import Users from "../../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.js";
import Product from "../../models/productModel.js";
import Cart from "../../models/Cart.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Address from "../../models/addressMode.js"
import Order from "../../models/order.js";
import Coupon from "../../models/Coupon.js";
import Wallet from "../../models/wallet.js";
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { productData } = req.body;
    const productId = productData._id;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    console.log(product,"shvbwshfbchew")
    console.log(product.salePrice)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(p => p.productId.toString() === productId.toString());

    if (existingProduct) {

      existingProduct.quantity += 1;
    } else {
    
      cart.products.push({
        productId: product._id,
        name: product.productName, 
        price: product.salePrice,  
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
  
    //  cart = await Cart.findOne({ userId }).populate('products.productId');

   

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for this user' });
    }
    await cart.populate('products.productId');
    console.log('Cart:', cart);
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




 


export const cartupdate = async (req, res) => { 
  console.log('Cart update route hit');
  
  const { product_id } = req.params; 
  const { quantity } = req.body; 
  
  try {
    const productData = await Product.findById(product_id); 
    const availableStock = productData.quantity;
    const productPrice = productData.salePrice; 

    console.log('Product ID:', product_id);
    console.log('Requested Quantity:', quantity);
    console.log('Available Stock:', availableStock);

    // Validate quantity
    if (quantity > availableStock) {
      return res.status(400).json({ count: availableStock });
    }

    const userId = req.user.id; 
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, 'products.productId': product_id }, 
      { $set: { 'products.$.quantity': quantity } }, 
      { new: true } 
    );

    if (!updatedCart) {
      return res.status(404).json({ message: 'Cart or product not found' });
    }

    
    const cartTotalPrice = updatedCart.products.reduce((total, product) => {
      return total + (product.price * product.quantity);
    }, 0);
    
   
    updatedCart.totalPrice = cartTotalPrice;
    await updatedCart.save();

    return res.status(200).json({ message: 'Quantity and total price updated successfully', cart: updatedCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return res.status(500).json({ message: 'Failed to update quantity', error });
  }
};


    

    export const deleteCart = async (req, res) => {
      const { product_id } = req.params; 
      const u_id = req.user.id; 
    
      try {
     
        const updatedCart = await Cart.findOneAndUpdate(
          { userId: u_id }, 
          { $pull: { products: { productId: product_id } } }, 
          { new: true } 
        )
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
      console.log("create")
      const userId = req.user.id;
      const { orderData } = req.body;
      const address = orderData.address;
         console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
      console.log(orderData);
    
      try {
        const products = orderData.products;
        if (!products || !Array.isArray(products) || products.length === 0) {
          return res.status(400).json({ error: 'No products provided' });
        }
    
    
        const newOrder = new Order({
          user: userId,
          products: products.map(product => ({
            productId: product.productId,
            name: product.name,
            quantity: product.quantity,
            price: product.price*product.quantity,
            status: 'Ordered',
          })),
          totalPrice: orderData.totalPrice,
          couponAmount:orderData.discount,
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
    
        // Save the order
        const savedOrder = await newOrder.save();
    
        for (const product of products) {
          const updatedProduct = await Product.findById(product.productId);
    
          if (!updatedProduct) {
            console.error(`Product not found: ${product.productId}`);
            return res.status(404).json({ error: `Product not found: ${product.productId}` });
          }
    
          if (updatedProduct.quantity >= product.quantity) {
            
            updatedProduct.quantity -= product.quantity; 
            await updatedProduct.save(); 
          } else {
            console.error(`Not enough stock for product ID ${product.productId}`);
            return res.status(400).json({ error: `Not enough stock for product ${product.name}` });
          }
        }
       console.log('ggggggggggggggggggggggggggggggggg')
        
       res.status(200).json(savedOrder)
        
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
      }
    };
    


   export  const getOrder = async (req, res) => {
      try {
        const userId = req.user.id; 
        const orders = await Order.find({ user: userId });
    
        if (!orders || orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this user.' });
        }
    
     
        res.status(200).json(orders)
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error });
      }
    };
   export const clearCart = async(req,res)=>{



  try {
    const userId = req.user.id; 

    
    await Cart.deleteMany({ userId });

    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};
export const UserCancelOrder = async (req,res)=>{
  const userId = req.user.id 
  const{orederId,productId} = req.body;
  
  const order = Order.findById({})
  


}


export const rz = async(req,res)=>{
 
  const razorpay = new  newRazorpay({
key_id : " rzp_test_homhAZdqfLrL9E",
key_secret : "cLeCN0YNzzNonfCUw12LPTtW"
  })
const options = req.body;
  const order = await razorpay.orders.create(options);

}
export const getCoupon = async (req, res) => {
  const { amount } = req.query;
  console.log(amount)

  try {
    
    const coupons = await Coupon.find({
      $and: [
        { maxPurchase: { $gte: amount } }, 
        { minPurchase: { $lte: amount } }
      ]
    });

    
    if (coupons.length === 0) {
      return res.status(404).json({ message: 'No coupons found for the specified amount.' });
    }

    // Send the found coupons
    return res.status(200).json(coupons);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while retrieving coupons.' });
  }
};

export const couponsapply = async (req, res) => {
  const { couponCode, totalPrice } = req.body;

  try {
    // Find the coupon in the database
    const coupon = await Coupon.findOne({ code: couponCode });

    // Check if the coupon exists
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code.' });
    }

    // Check if the total price meets the coupon's requirements
    if (totalPrice < coupon.minPurchase || totalPrice > coupon.maxPurchase) {
      return res.status(400).json({
        success: false,
        message: `Coupon can only be applied on amounts between ₹${coupon.minPurchase} and ₹${coupon.maxPurchase}.`,
      });
    }

    // Calculate the discount based on the percentage
    const discountAmount = (totalPrice * coupon.discount) / 100;
console.log(discountAmount)
    // Optionally, ensure the discount does not exceed the maximum discount allowed
    const maxDiscount = coupon.amount || Infinity; // If no max discount, use Infinity
    const finalDiscount = Math.min(discountAmount, maxDiscount);

    res.json({ success: true, discountAmount: finalDiscount });
  } catch (error) {
    console.error('Error applying coupon:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};





export const cancelOrder = async (req, res) => {
  console.log("Cancel Order Initiated");
  const userId = req.user.id;

  try {
    const { orderId, productId } = req.body;

    // Find the order and the specific product by their IDs
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "products._id": productId },  // Find the order and the specific product
      { $set: { "products.$.status": "Cancelled" } },  // Update product's status
      { new: true }  // Return the updated document
    );


    if (!order) {
      return res.status(404).json({ message: "Order or product not found" });
    }

    console.log("Order found and product status updated.");
         
    // Fetch the specific product details for refund calculation
    const product = order.products.find(p => p._id.toString() === productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found in the order" });
    }

    // Calculate total price and proportional refund amount based on the coupon
    const totalPrice = order.products.reduce((sum, p) => sum + p.price, 0); // Sum total price of all products in the order
    const couponAmount = order.couponAmount || 0;  // Coupon value applied to the entire order
    const refundAmount = (product.price / totalPrice) * couponAmount;

    const actualRefund = product.price - refundAmount;  // Final amount to be refunded after applying coupon share
    console.log(`Refund Amount: ${refundAmount}, Actual Refund: ${actualRefund}`);

    // Fetch the user's wallet
    let walletData = await Wallet.findOne({ user: userId });

    // If wallet doesn't exist, create a new one
    if (!walletData) {
      walletData = new Wallet({
        user: userId,
        balance: 0,
        transactions: []
      });
      await walletData.save();  // Save the newly created wallet
    }

    // Update wallet balance and log refund transaction
    walletData.balance += actualRefund;
    console.log(`Wallet updated with ${actualRefund}`);

    walletData.transactions.push({
      description: `Refund for cancelled product: ${product.name}`,
      type: 'credit',
      amount: actualRefund
    });

    // If a coupon was applied, adjust the remaining coupon amount
    if (couponAmount > 0) {
      console.log("Adjusting coupon amount");
      order.couponAmount -= refundAmount;
      
      await order.save();  // Save the updated order
    }
    order.totalPrice=order.totalPrice-product.price
    await order.save();
    await walletData.save();  // Save the wallet with updated balance and transaction

    res.status(200).json({
      message: "Order cancelled successfully, refund processed",
      order,
      refundAmount: actualRefund  // Return the actual refund amount after applying coupon
    });

  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const returnOrder = async (req, res) => {
  try {
    const { orderId, productId } = req.body; // Assuming productId and orderId are passed as URL params
console.log(productId)
   
    const order = await Order.findOneAndUpdate(
      { _id: orderId, "products._id": productId },  // Find the order and product
      { $set: { "products.$.status": "Returned" } },     // Use positional operator to update status
      { new: true } 
    );

    if (!order) {
      return res.status(404).json({ message: "Order or product not found" });
    }

    res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




    
    
export default createOrder    