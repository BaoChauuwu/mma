const Order = require('../models/Order');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    // Deduct quantity from products
    const items = req.body.items || [];
    for (let item of items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { quantity: -item.quantity } // decrement by ordered amount
        });
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const { filter } = req.query; // 'Day', 'Month', 'Year', 'All Time'
    let dateQuery = {};

    if (filter) {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      if (filter === 'Day') {
        const end = new Date(start);
        end.setDate(start.getDate() + 1);
        dateQuery = { createdAt: { $gte: start, $lt: end } };
      } else if (filter === 'Month') {
        start.setDate(1); // Start of month
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        dateQuery = { createdAt: { $gte: start, $lt: end } };
      } else if (filter === 'Year') {
        start.setMonth(0, 1); // Start of year
        const end = new Date(start);
        end.setFullYear(start.getFullYear() + 1);
        dateQuery = { createdAt: { $gte: start, $lt: end } };
      }
    }

    const orders = await Order.find(dateQuery);
    const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({ totalRevenue: total, orders });
  } catch (error) {
    res.status(500).json({ error: "Server error getting revenue" });
  }
};