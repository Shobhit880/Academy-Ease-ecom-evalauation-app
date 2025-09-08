const express = require('express');
const router = express.Router();

// Mock data for testing (you can replace with actual database calls later)
const mockProductTrends = [
    { date: '2025-09-01', total_products: 120, products_added: 5, products_removed: 2 },
    { date: '2025-09-02', total_products: 123, products_added: 3, products_removed: 0 },
    { date: '2025-09-03', total_products: 128, products_added: 6, products_removed: 1 },
    { date: '2025-09-04', total_products: 125, products_added: 2, products_removed: 5 },
    { date: '2025-09-05', total_products: 130, products_added: 8, products_removed: 3 }
];

const mockVisitorData = [
    { date: '2025-09-01', visitors: 120 },
    { date: '2025-09-02', visitors: 150 },
    { date: '2025-09-03', visitors: 182 },
    { date: '2025-09-04', visitors: 165 },
    { date: '2025-09-05', visitors: 195 }
];

// Helper function to filter data by date range
function filterByDateRange(data, startDate, endDate) {
    if (!startDate || !endDate) return data;
    return data.filter(item => item.date >= startDate && item.date <= endDate);
}

// Helper function to format bucket dates
function formatBucketResponse(data, bucket = 'day') {
    return data.map(item => ({
        startDate: item.date,
        endDate: item.date, // For day bucket, start and end are same
        ...item
    }));
}

// GET /dashboard/products
router.get('/products', (req, res) => {
    try {
        const { startDate, endDate, bucket = 'day' } = req.query;
        
        // Validate bucket parameter
        const validBuckets = ['day', 'week', 'month'];
        if (!validBuckets.includes(bucket)) {
            return res.status(400).json({
                error: 'Invalid bucket parameter',
                message: 'Bucket must be one of: day, week, month'
            });
        }
        
        // Filter data by date range if provided
        let filteredData = filterByDateRange(mockProductTrends, startDate, endDate);
        
        // Get current total (latest record)
        const currentTotal = filteredData.length > 0 
            ? filteredData[filteredData.length - 1].total_products 
            : 128;
        
        // Format trend data with bucket information
        const trend = filteredData.map(item => ({
            startDate: item.date,
            endDate: item.date,
            totalProducts: item.total_products,
            productsAdded: item.products_added,
            productsRemoved: item.products_removed
        }));
        
        res.json({
            currentTotal,
            trend
        });
        
    } catch (error) {
        console.error('Products endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Error fetching product trends'
        });
    }
});

// GET /dashboard/visitors
router.get('/visitors', (req, res) => {
    try {
        const { startDate, endDate, bucket = 'day' } = req.query;
        
        // Validate bucket parameter
        const validBuckets = ['day', 'week', 'month'];
        if (!validBuckets.includes(bucket)) {
            return res.status(400).json({
                error: 'Invalid bucket parameter',
                message: 'Bucket must be one of: day, week, month'
            });
        }
        
        // Filter data by date range if provided
        let filteredData = filterByDateRange(mockVisitorData, startDate, endDate);
        
        // Calculate total visitors
        const totalVisitors = filteredData.reduce((sum, item) => sum + item.visitors, 0);
        
        // Format visitor data with bucket information
        const visitorsByBucket = filteredData.map(item => ({
            startDate: item.date,
            endDate: item.date,
            visitors: item.visitors
        }));
        
        res.json({
            totalVisitors,
            visitorsByBucket
        });
        
    } catch (error) {
        console.error('Visitors endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: 'Error fetching visitor trends'
        });
    }
});

// Health check for dashboard routes
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Dashboard API',
        timestamp: new Date().toISOString(),
        availableEndpoints: [
            'GET /dashboard/products',
            'GET /dashboard/visitors',
            'GET /dashboard/health'
        ]
    });
});

// Test route to verify routes are working
router.get('/test', (req, res) => {
    res.json({
        message: '🎉 Dashboard routes are working perfectly!',
        timestamp: new Date().toISOString(),
        testPassed: true
    });
});

module.exports = router;
