import Order from "../../models/order.js";
import Users from "../../models/userModel.js";
import Product from "../../models/productModel.js";
export const getOrders = async (req, res) => {
    try {
      const orders = await Order.find({});
      if (!orders) {
        return res.status(404).json({ message: 'No orders found' });
      }
      
      res.status(200).send({data:orders});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Unable to fetch orders' });
    }
  };
  export const orderdetails = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'name') 
        .populate('products.productId', 'name'); 
  
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error });
    }
  };
  
 


  export const updateOrderStatus = async (req, res) => {
    try {
      const { orderId, productId } = req.params; 
      const { status } = req.body;
  
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const order = await Order.findOneAndUpdate(
        { _id: orderId, "products.productId": productId },
        { $set: { "products.$.status": status } },
        { new: true } 
      );
  
      if (!order) {
        return res.status(404).json({ message: "Order or product not found" });
      }
  
      res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  export const editOrderStatus =  async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus, paymentStatus } = req.body;
  
    try {

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          orderStatus,
          paymentStatus,
          updatedAt: Date.now(), 
        },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({
        message: 'Order updated successfully',
        updatedOrder,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Failed to update order', error });
    }
  };
  
