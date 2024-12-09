const db = require('../config/db.js');

const orderModel = {
    getAllOrders: (callback) => {
        const query = `SELECT o.order_no, GROUP_CONCAT(p.name ORDER BY p.name ASC SEPARATOR ', ') AS products,
                GROUP_CONCAT(oi.quantity ORDER BY p.name ASC SEPARATOR ', ') AS quantities,
                GROUP_CONCAT(oi.size ORDER BY p.name ASC SEPARATOR ', ') AS sizes,
                o.total_amount, o.status
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            JOIN products p ON oi.product_id = p.product_id
            GROUP BY o.order_no, o.total_amount, o.status
            ORDER BY o.order_no ASC`;

        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    markAsDone: (orderNo, callback) => {
        const getOrderDetailsQuery = `
            SELECT o.order_id, o.total_amount, oi.product_id, oi.quantity, oi.size
            FROM orders o
            JOIN order_items oi ON o.order_id = oi.order_id
            WHERE o.order_no = ?`;

        // Fetch order details
        db.query(getOrderDetailsQuery, [orderNo], (err, results) => {
            if (err) {
                console.error('Error fetching order details:', err);
                return callback(err);
            }

            if (results.length === 0) {
                console.error('Order not found for order_no:', orderNo);
                return callback(new Error('Order not found'));
            }

            const orderDetails = results;
            const orderId = orderDetails[0].order_id;
            const totalAmount = orderDetails[0].total_amount;

            console.log('Order Details:', orderDetails); // Debugging: Log order details

            // Insert into sales table
            const insertSalesQuery = `
                INSERT INTO sales (order_id, total_amount, status)
                VALUES (?, ?, 'Completed')`;

            db.query(insertSalesQuery, [orderId, totalAmount], (err, saleResult) => {
                if (err) {
                    console.error('Error inserting into sales:', err);
                    return callback(err);
                }

                const saleId = saleResult.insertId;
                console.log('Inserted into sales, sale_id:', saleId); // Debugging: Log saleId

                // Prepare data for sales_items insertion
                const salesItemsData = orderDetails.map(item => [
                    saleId, item.product_id, item.quantity, item.size
                ]);

                console.log('Sales Items Data:', salesItemsData); // Debugging: Log sales items data

                const insertSalesItemsQuery = `
                    INSERT INTO sales_items (sale_id, product_id, quantity, size)
                    VALUES ?`;

                db.query(insertSalesItemsQuery, [salesItemsData], (err, result) => {
                    if (err) {
                        console.error('Error inserting into sales_items:', err);
                        return callback(err);
                    }

                    console.log(`Inserted into sales_items, rows affected: ${result.affectedRows}`);

                    // Delete from order_items and orders after successful insertions
                    const deleteOrderItemsQuery = `DELETE FROM order_items WHERE order_id = ?`;
                    const deleteOrderQuery = `DELETE FROM orders WHERE order_id = ?`;

                    db.query(deleteOrderItemsQuery, [orderId], (err) => {
                        if (err) {
                            console.error('Error deleting from order_items:', err);
                            return callback(err);
                        }

                        db.query(deleteOrderQuery, [orderId], (err) => {
                            if (err) {
                                console.error('Error deleting from orders:', err);
                                return callback(err);
                            }

                            console.log(`Order ${orderNo} marked as done.`);
                            callback(null);  // Successfully completed the process
                        });
                    });
                });
            });
        });
    }
    
};

module.exports = orderModel;
