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
    
        db.beginTransaction((err) => {
          if (err) {
            console.error('Transaction start error:', err);
            return callback(err);
          }
    
          db.query(getOrderDetailsQuery, [orderNo], (err, orderResults) => {
            if (err) {
              console.error('Error fetching order data:', err);
              db.rollback(() => callback(err));
            }
    
            if (orderResults.length === 0) {
              return db.rollback(() => callback(new Error('No such order found')));
            }
    
            const orderDetails = orderResults;
    
            const insertSalesQuery = `
              INSERT INTO sales (order_id, total_amount, status) 
              VALUES (?, ?, 'Completed')`;
    
            db.query(insertSalesQuery, [orderDetails[0].order_id, orderDetails[0].total_amount], (err, result) => {
              if (err) {
                console.error('Error inserting into sales:', err);
                db.rollback(() => callback(err));
              }
    
              const saleId = result.insertId;
    
              const insertSalesItemsQuery = `
                INSERT INTO sales_items (sale_id, product_id, quantity, size) 
                VALUES ?`;
    
              const salesItemsData = orderDetails.map(item => [saleId, item.product_id, item.quantity, item.size]);
    
              db.query(insertSalesItemsQuery, [salesItemsData], (err) => {
                if (err) {
                  console.error('Error inserting into sales_items:', err);
                  db.rollback(() => callback(err));
                }
    
                db.query('DELETE FROM order_items WHERE order_id = ?', [orderDetails[0].order_id], (err) => {
                  if (err) {
                    console.error('Error deleting from order_items:', err);
                    db.rollback(() => callback(err));
                  }
    
                  db.commit((err) => {
                    if (err) {
                      console.error('Transaction commit error:', err);
                      db.rollback(() => callback(err));
                    }
    
                    console.log('Transaction successfully committed');
                    callback(null);
                  });
                });
              });
            });
          });
        });
      },

      getTotalSales: (callback) => {
        const query = `
            SELECT SUM(total_amount) AS total_sales
            FROM sales
            WHERE status = 'Completed' AND DATE(created_at) = CURDATE()
        `;
    
        db.query(query, (err, results) => {
            if (err) return callback(err);
    
            const totalSales = parseFloat(results[0]?.total_sales) || 0;
            callback(null, totalSales);
        });
    },

    getTopBestSellers: (callback) => {
      const query = `
          SELECT p.name, SUM(si.quantity) AS total_quantity
          FROM sales_items si
          JOIN products p ON si.product_id = p.product_id
          JOIN sales s ON si.sale_id = s.sale_id
          WHERE s.status = 'Completed' AND DATE(s.created_at) = CURDATE()
          GROUP BY p.product_id
          ORDER BY total_quantity DESC
          LIMIT 3
      `;
  
      db.query(query, (err, results) => {
          if (err) return callback(err);
          callback(null, results);
      });
  },

getSalesData: (startDate, endDate, callback) => {
  const query = `
    SELECT 
      p.name AS product_name, 
      ps.name AS size, 
      SUM(si.quantity) AS quantity_sold, 
      SUM(si.quantity * ps.price) AS total_amount
    FROM 
      sales s
      JOIN sales_items si ON s.sale_id = si.sale_id
      JOIN products p ON si.product_id = p.product_id
      JOIN product_sizes ps ON si.product_id = ps.product_id AND si.size = ps.name
    WHERE 
      s.status = 'Completed'
      AND DATE(s.created_at) BETWEEN ? AND ?
    GROUP BY 
      p.product_id, ps.name
    ORDER BY 
      quantity_sold DESC
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
},

getDailySales: (startDate, endDate, callback) => {
  const query = `
    SELECT 
      DATE(created_at) AS date,
      SUM(total_amount) AS total_sales
    FROM 
      sales
    WHERE 
      status = 'Completed'
      AND DATE(created_at) BETWEEN ? AND ?
    GROUP BY 
      DATE(created_at)
    ORDER BY 
      DATE(created_at)
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
},

getWeeklySales: (startDate, endDate, callback) => {
  const query = `
    SELECT 
      YEAR(created_at) AS year,
      WEEK(created_at, 1) AS week,
      SUM(total_amount) AS total_sales
    FROM 
      sales
    WHERE 
      status = 'Completed'
      AND DATE(created_at) BETWEEN ? AND ?
    GROUP BY 
      YEAR(created_at), WEEK(created_at, 1)
    ORDER BY 
      YEAR(created_at), WEEK(created_at, 1)
  `;

  db.query(query, [startDate, endDate], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
}
    
};

module.exports = orderModel;
