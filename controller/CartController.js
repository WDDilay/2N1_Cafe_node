const cartModel = require('../models/CartModel'); 

const cartController = {
    addToCart: (req, res) => {
        // Log the received request body for debugging
        console.log('Request body:', req.body);

        const { productId, size, quantity, price } = req.body;

        // Check if all fields are provided
        if (!productId || !size || !quantity || !price) {
            console.log('Missing fields:', { productId, size, quantity, price }); // Debug missing fields
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate data types
        if (
            isNaN(parseInt(productId)) ||
            typeof size !== 'string' ||
            isNaN(parseInt(quantity)) ||
            isNaN(parseFloat(price))
        ) {
            console.log('Invalid data types:', { productId, size, quantity, price }); // Debug invalid data
            return res.status(400).json({ error: 'Invalid data provided.' });
        }

        // Simulated cart ID (replace with your logic)
        const cartId = 1;

        // Add item to cart using the model
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

                console.log('Item added to cart successfully:', result); // Debug success response

                res.status(200).json({
                    message: 'Item added to cart successfully.',
                    data: result,
                });
            }
        );
    },

    getCartItems: (req, res) => {
        const cartId = 1; // Simulated cart ID (replace with your logic)

        cartModel.getCartItems(cartId, (err, cartItems) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to fetch cart items.' });
            }

            res.status(200).json(cartItems); // Return cart items
        });
    },

    deleteCartItem: (req, res) => {
        const { cartItemId } = req.params;
    
        // Validate input
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
    
};

module.exports = cartController;
