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
    
        orderModel.markAsDone(order_no, (err) => {
            if (err) {
                console.error('Error marking order as done:', err);
                return res.status(500).send('Error marking order as done');
            }
            res.send({ message: 'Order marked as done and recorded in sales.' });
        });
    }

   
    

    
};

module.exports = orderController;
