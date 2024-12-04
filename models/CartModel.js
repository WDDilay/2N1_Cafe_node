const db = require('../config/db.js');

const cartModel = {
    // Add Item to Cart
    addItemToCart: (cartId, productId, size, quantity, price, callback) => {
        const checkQuery = `
            SELECT * 
            FROM cart_items 
            WHERE cart_id = ? AND product_id = ? AND size = ?
        `;
        db.query(checkQuery, [cartId, productId, size], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }

            if (results.length > 0) {
                const updateQuery = `
                    UPDATE cart_items 
                    SET quantity = quantity + ? 
                    WHERE cart_item_id = ?
                `;
                db.query(updateQuery, [quantity, results[0].cart_item_id], (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return callback(err);
                    }
                    callback(null, result);
                });
            } else {
                const insertQuery = `
                    INSERT INTO cart_items (cart_id, product_id, size, quantity, price)
                    VALUES (?, ?, ?, ?, ?)
                `;
                db.query(insertQuery, [cartId, productId, size, quantity, price], (err, result) => {
                    if (err) {
                        console.error('Database error:', err);
                        return callback(err);
                    }
                    callback(null, result);
                });
            }
        });
    },

    // Get Cart Items
    getCartItems: (cartId, callback) => {
        const query = `
            SELECT ci.cart_item_id, p.name, ci.size, ci.quantity, ci.price, p.product_image
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `;
        db.query(query, [cartId], (err, results) => {
            if (err) {
                console.error('Error fetching cart items:', err);
                return callback(err);
            }
            callback(null, results);
        });
    },

    // Delete Single Item
    deleteCartItem: (cartItemId, callback) => {
        const query = `DELETE FROM cart_items WHERE cart_item_id = ?`;

        db.query(query, [cartItemId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    // Delete All Items
    deleteAllCartItems: (cartId, callback) => {
        const query = `DELETE FROM cart_items WHERE cart_id = ?`;

        db.query(query, [cartId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
            callback(null, result);
        });
    },

    proceedToOrder: (cartId, callback) => {
        // Generate Order No. (001 to 100 cycling)
        const orderNoQuery = `
            SELECT MAX(order_no) AS last_order_no
            FROM orders
        `;

        db.query(orderNoQuery, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }

            let lastOrderNo = results[0]?.last_order_no || '000';
            let nextOrderNo = parseInt(lastOrderNo) + 1;
            if (nextOrderNo > 100) nextOrderNo = 1;
            const formattedOrderNo = String(nextOrderNo).padStart(3, '0');

            // Get all cart items
            const getCartItemsQuery = `
                SELECT * FROM cart_items WHERE cart_id = ?
            `;
            db.query(getCartItemsQuery, [cartId], (err, cartItems) => {
                if (err) {
                    console.error('Database error:', err);
                    return callback(err);
                }

                if (cartItems.length === 0) {
                    return callback(null, { message: 'Cart is empty' });
                }

                // Calculate total amount
                const totalAmount = cartItems.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0
                );

                // Create new order
                const createOrderQuery = `
                    INSERT INTO orders (order_no, cart_id, total_amount)
                    VALUES (?, ?, ?)
                `;
                db.query(
                    createOrderQuery,
                    [formattedOrderNo, cartId, totalAmount],
                    (err, orderResult) => {
                        if (err) {
                            console.error('Database error:', err);
                            return callback(err);
                        }

                        const orderId = orderResult.insertId;

                        // Move cart items to order_items
                        const orderItemsQuery = `
                            INSERT INTO order_items (order_id, product_id, size, quantity, price)
                            SELECT ?, product_id, size, quantity, price
                            FROM cart_items
                            WHERE cart_id = ?
                        `;
                        db.query(orderItemsQuery, [orderId, cartId], (err) => {
                            if (err) {
                                console.error('Database error:', err);
                                return callback(err);
                            }

                            // Clear cart
                            const clearCartQuery = `
                                DELETE FROM cart_items WHERE cart_id = ?
                            `;
                            db.query(clearCartQuery, [cartId], (err) => {
                                if (err) {
                                    console.error('Database error:', err);
                                    return callback(err);
                                }

                                callback(null, {
                                    message: 'Order placed successfully',
                                    order_no: formattedOrderNo,
                                    total_amount: totalAmount,
                                });
                            });
                        });
                    }
                );
            });
        });
    }
};

module.exports = cartModel;
