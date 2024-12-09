const db = require('./config/db.js'); // Import the database connection

function testInsert() {
    const orderId = 13;
    const totalAmount = '129.00';

    // Check if the order_id exists in the orders table
    const checkOrderQuery = 'SELECT * FROM orders WHERE order_id = ?';
    
    db.query(checkOrderQuery, [orderId], (err, orderResults) => {
        if (err) {
            console.error('Error checking if order exists:', err);
            return;
        }

        if (orderResults.length === 0) {
            console.error('Order ID 11 does not exist in the orders table.');
            return;
        }

        // If the order exists, proceed with inserting into sales
        const salesQuery = `
            INSERT INTO sales (order_id, total_amount, status)
            VALUES (?, ?, 'Completed')
        `;

        db.query(salesQuery, [orderId, totalAmount], (err, saleResult) => {
            if (err) {
                console.error('Error inserting into sales:', err);
                return;
            }

            console.log('Inserted into sales, sale_id:', saleResult.insertId);
        });
    });
}

testInsert();
