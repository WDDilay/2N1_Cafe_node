const orderModel = require('../models/OrderModel');

const orderController = {
    orders: (req, res) => {
        orderModel.getAllOrders((err, orders) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).send('Error fetching orders');
            }
            // Pass the fetched orders to the template
            res.render('admin/orders', { orders });
        });
    },

    markDone: (req, res) => {
        const { order_no } = req.body;
    
        if (!order_no) {
          console.error('No order number provided');
          return res.status(400).send({ message: 'Order number is required' });
        }
    
        console.log('Received order number:', order_no);
    
        orderModel.markAsDone(order_no, (err) => {
          if (err) {
            console.error('Error marking order as done:', err);
            return res.status(500).send({ message: 'Error marking order as done' });
          }
    
          console.log('Order marked as done successfully');
          res.status(200).send({ message: 'Order marked as done and recorded in sales.' });
        });
      },

      admin: (req, res) => {
        orderModel.getTotalSales((err, totalSales) => {
            if (err) {
                console.error('Error fetching total sales:', err);
                totalSales = 0; // Default to 0 in case of an error
            }
    
            orderModel.getTopBestSellers((err, topBestSellers) => {
                if (err) {
                    console.error('Error fetching top best sellers:', err);
                    topBestSellers = []; // Default to an empty array
                }
    
                orderModel.getAllOrders((err, orders) => {
                    if (err) {
                        console.error('Error fetching orders:', err);
                        orders = []; // Default to empty array
                    }
    
                    // Ensure totalSales is a float before sending to EJS
                    res.render('admin/admin', {
                        totalSales: totalSales, // Already a float from OrderModel
                        topBestSellers,
                        orders,
                    });
                });
            });
        });
    },

   
    

    
};

module.exports = orderController;
