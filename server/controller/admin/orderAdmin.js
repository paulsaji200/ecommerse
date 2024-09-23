import Order from "../../models/order.js";
export const getOrders = async (req, res) => {
    try {
      const orders = await Order.find({});
      if (!orders) {
        return res.status(404).json({ message: 'No orders found' });
      }
      console.log(orders)
      res.status(200).send({data:orders});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error: Unable to fetch orders' });
    }
  };
  
  
  