const db = require('../config/db.js');

const orderModel = {
    getAllOrders: (callback) => {
        const query = `
            SELECT 
                o.order_no,
                GROUP_CONCAT(p.name ORDER BY p.name ASC SEPARATOR ', ') AS products,
                GROUP_CONCAT(oi.quantity ORDER BY p.name ASC SEPARATOR ', ') AS quantities,
                GROUP_CONCAT(oi.size ORDER BY p.name ASC SEPARATOR ', ') AS sizes,
                o.total_amount,
                o.status
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            GROUP BY o.order_no, o.total_amount, o.status
            ORDER BY o.order_no ASC
        `;

        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
    
};

module.exports = orderModel;
