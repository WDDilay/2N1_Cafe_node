const db = require('../config/db.js');

const cartModel = {
    addItemToCart: (cartId, productId, size, quantity, price, callback) => {
        const query = `
            INSERT INTO cart_items (cart_id, product_id, size, quantity, price)
            VALUES (?, ?, ?, ?, ?)
        `;

        // Execute the query
        db.query(query, [cartId, productId, size, quantity, price], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }

            callback(null, result); // Send back the result of the query
        });
    },

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
            callback(null, results); // Return the cart items
        });
    }
};

module.exports = cartModel;
