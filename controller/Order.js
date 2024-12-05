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
    

    
};

module.exports = orderController;
