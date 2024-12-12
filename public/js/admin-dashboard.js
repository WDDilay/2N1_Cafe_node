let salesChart;


function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Sales',
                data: [],
                borderColor: '#f5a623',
                backgroundColor: 'rgba(245, 166, 35, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ffffff', // Change Y-axis numbers to white
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '₱' + value.toLocaleString();
                        }
                    },
                    grid: {
                        color: '#ffffff' // Change Y-axis grid lines to white
                    }
                },
                x: {
                    ticks: {
                        color: '#ffffff', // Change X-axis numbers to white
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: '#ffffff' // Change X-axis grid lines to white
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#f5a623',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += '₱' + context.parsed.y.toLocaleString();
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}



function updateSalesChart(viewType) {
        const rawData = viewType === 'daily' ? dailySalesData : weeklySalesData;
    
        // Ensure data is an array
        const data = Array.isArray(rawData) ? rawData : JSON.parse(rawData || '[]');
    
        if (!data.length) {
            console.warn('No data available for', viewType, 'view.');
            return;
        }

    // Generate labels and values based on the view type
    const labels = data.map(item => {
        if (viewType === 'daily') {
            const date = new Date(item.date);
            return date.toLocaleDateString('en-US'); // Format: MM/DD/YYYY
        } else if (viewType === 'weekly') {
            return `Week ${item.week}`;
        }
    });

    const values = data.map(item => {
        const sales = parseFloat(item.total_sales);
        if (isNaN(sales)) {
            console.error('Invalid total_sales value:', item.total_sales, 'in', viewType, 'data:', item);
            return 0; // Default to 0 for invalid values
        }
        return sales;
    });

    // Update chart data
    salesChart.data.labels = labels;
    salesChart.data.datasets[0].data = values;
    salesChart.update();

    console.log('Updated chart with', viewType, 'data:', { labels, values });
}


document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded. Initializing chart...');
    initializeSalesChart();
    
    const salesViewSelect = document.getElementById('salesViewSelect');
    salesViewSelect.addEventListener('change', function() {
        console.log('View changed to:', this.value);
        updateSalesChart(this.value);
    });
    
    // Initial chart update
    console.log('Performing initial chart update...');
    updateSalesChart('daily');
});

// Log the data to check if it's properly loaded
console.log('Daily Sales Data:', dailySalesData);
console.log('Weekly Sales Data:', weeklySalesData);

