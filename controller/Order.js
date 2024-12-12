const orderModel = require('../models/OrderModel');
const ExcelJS = require('exceljs');

const orderController = {
  exportSales: async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const { startDate = today, endDate = today } = req.query;

        orderModel.getSalesData(startDate, endDate, async (err, salesData) => {
            if (err) {
                console.error('Error fetching sales data:', err);
                return res.status(500).send('Error fetching sales data');
            }

            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sales Report');

            worksheet.columns = [
                { header: 'Product', key: 'product', width: 30 },
                { header: 'Size', key: 'size', width: 10 },
                { header: 'Quantity Sold', key: 'quantity', width: 15 },
                { header: 'Total Amount', key: 'amount', width: 15 }
            ];

            let grandTotalQuantity = 0;
            let grandTotalAmount = 0;

            salesData.forEach(item => {
                worksheet.addRow({
                    product: item.product_name,
                    size: item.size,
                    quantity: item.quantity_sold,
                    amount: item.total_amount
                });
                grandTotalQuantity += Number(item.quantity_sold);
                grandTotalAmount += Number(item.total_amount);
            });

            worksheet.addRow({
                product: 'Grand Total',
                size: '',
                quantity: grandTotalQuantity,
                amount: grandTotalAmount
            });

            const filename = `SalesReport_${startDate}.xlsx`;

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

            await workbook.xlsx.write(res);
            res.end();
        });
    } catch (error) {
        console.error('Error exporting sales data:', error);
        res.status(500).send('Error exporting sales data');
    }
  }
,
    orders: (req, res) => {
        orderModel.getAllOrders((err, orders) => {
            if (err) {
                console.error('Error fetching orders:', err);
                return res.status(500).send('Error fetching orders');
            }
            // Pass the fetched orders to the template
            res.render('admin/orders', { orders });
        });
    },

    markDone: (req, res) => {
        const { order_no } = req.body;
    
        if (!order_no) {
          console.error('No order number provided');
          return res.status(400).send({ message: 'Order number is required' });
        }
    
        console.log('Received order number:', order_no);
    
        orderModel.markAsDone(order_no, (err) => {
          if (err) {
            console.error('Error marking order as done:', err);
            return res.status(500).send({ message: 'Error marking order as done' });
          }
    
          console.log('Order marked as done successfully');
          res.status(200).send({ message: 'Order marked as done and recorded in sales.' });
        });
      },

      admin: (req, res) => {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
        orderModel.getTotalSales((err, totalSales) => {
          if (err) {
            console.error('Error fetching total sales:', err);
            totalSales = 0;
          }
    
          orderModel.getTopBestSellers((err, topBestSellers) => {
            if (err) {
              console.error('Error fetching top best sellers:', err);
              topBestSellers = [];
            }
    
            orderModel.getDailySales(startDate, endDate, (err, dailySales) => {
              if (err) {
                console.error('Error fetching daily sales:', err);
                dailySales = [];
              }
    
              orderModel.getWeeklySales(startDate, endDate, (err, weeklySales) => {
                if (err) {
                  console.error('Error fetching weekly sales:', err);
                  weeklySales = [];
                }
    
                orderModel.getAllOrders((err, orders) => {
                  if (err) {
                    console.error('Error fetching orders:', err);
                    orders = [];
                  }
    
                  res.render('admin/admin', {
                    totalSales,
                    topBestSellers,
                    orders,
                    dailySales: JSON.stringify(dailySales),
                    weeklySales: JSON.stringify(weeklySales)
                  });
                });
              });
            });
          });
        });
      },

      todaysSales: (req, res) => {
        orderModel.getTodaysSales((err, salesData) => {
          if (err) {
            console.error('Error fetching today\'s sales:', err);
            return res.status(500).send('Error fetching sales data');
          }
          res.status(200).json(salesData);
        });
      }

};

module.exports = orderController;
