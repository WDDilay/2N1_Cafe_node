// controllers/StaffController.js
const s = [
    { name: 'John Doe', date: '2024-11-01', status: 'Present' },
    { name: 'Jane Smith', date: '2024-11-01', status: 'Absent' },
    // Add more mock data as needed
];

const salesData = {
    daily: [120, 150, 90, 200, 170, 110, 130], // Mock daily sales data
    bestSeller: ['Bubble Tea', 'Milk Tea', 'Fruit Tea'], // Mock best-seller data
};

exports.getDashboard = (req, res) => {
    res.render('dashboard', { s });
};

exports.getSalesReport = (req, res) => {
    const { category } = req.params;
    let reportData;

    if (category === 'daily') {
        reportData = salesData.daily;
    } else if (category === 'best-seller') {
        reportData = salesData.bestSeller;
    }

    res.json(reportData);
};
