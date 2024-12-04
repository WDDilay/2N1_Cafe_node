const cartModel = require('../models/CartModel');

const cartController = {
    addToCart: (req, res) => {
        console.log('Request body:', req.body);

        const { productId, size, quantity, price } = req.body;

        if (!productId || !size || !quantity || !price) {
            console.log('Missing fields:', { productId, size, quantity, price });
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (
            isNaN(parseInt(productId)) ||
            typeof size !== 'string' ||
            isNaN(parseInt(quantity)) ||
            isNaN(parseFloat(price))
        ) {
            console.log('Invalid data types:', { productId, size, quantity, price });
            return res.status(400).json({ error: 'Invalid data provided.' });
        }

        const cartId = 1; // Simulated cart ID (replace with dynamic logic if available)

        cartModel.addItemToCart(
            cartId,
            parseInt(productId),
            size,
            parseInt(quantity),
            parseFloat(price),
            (err, result) => {
                if (err) {
                    console.error('Error adding to cart:', err);
                    return res.status(500).json({ error: 'Failed to add item to cart.' });
                }

                console.log('Item added to cart successfully:', result);

                res.status(200).json({
                    message: 'Item added to cart successfully.',
                    data: result,
                });
            }
        );
    },

    getCartItems: (req, res) => {
        const cartId = 1; // Simulated cart ID (replace with dynamic logic if available)

        cartModel.getCartItems(cartId, (err, cartItems) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch cart items.' });
            }

            res.status(200).json(cartItems);
        });
    },

    deleteCartItem: (req, res) => {
        const { cartItemId } = req.params;

        if (!cartItemId || isNaN(parseInt(cartItemId))) {
            return res.status(400).json({ error: 'Invalid cart item ID.' });
        }

        cartModel.deleteCartItem(parseInt(cartItemId), (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete cart item.' });
            }

            res.status(200).json({ message: 'Cart item deleted successfully.', data: result });
        });
    },

    deleteAllCartItems: (req, res) => {
        const cartId = req.user ? req.user.cartId : 1; // Replace with dynamic logic
    
        if (!cartId || isNaN(parseInt(cartId))) {
            return res.status(400).json({ error: 'Invalid cart ID.' });
        }
    
        cartModel.deleteAllCartItems(parseInt(cartId), (err, result) => {
            if (err) {
                console.error(`Error deleting items for cartId ${cartId}:`, err);
                return res.status(500).json({ error: 'Failed to delete all cart items.' });
            }
    
            if (result.affectedRows === 0) {
                return res.status(200).json({ message: 'Cart is already empty.' });
            }
    
            res.status(200).json({
                message: 'All cart items deleted successfully.',
                data: result,
            });
        });
    },

    proceedToPayment: (req, res) => {
        const cartId = req.body.cartId; // Assume cartId is sent in the request body
    
        cartModel.proceedToOrder(cartId, (err, result) => {
            if (err) {
                console.error('Error processing order:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
    
            res.json(result);
        });
    }
};

module.exports = cartController;
