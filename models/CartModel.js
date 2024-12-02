const db = require('../config/db.js');

const cartModel = {
    addItemToCart: (cartId, productId, size, quantity, price, callback) => {
        // Check if the item already exists in the cart
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
                // If the item exists, update the quantity
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
                // If the item does not exist, insert it
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
    },

    deleteCartItem: (cartItemId, callback) => {
        const query = `DELETE FROM cart_items WHERE cart_item_id = ?`;
    
        db.query(query, [cartItemId], (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return callback(err);
            }
    
            callback(null, result); // Return the result of the deletion
        });
    },
    
};

module.exports = cartModel;
