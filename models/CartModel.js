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
    }
};

module.exports = cartModel;
