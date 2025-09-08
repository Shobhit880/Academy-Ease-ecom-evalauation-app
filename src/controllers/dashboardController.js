const analyticsService = require('../services/analyticsService');
const { validateDateRange, validateBucket } = require('../utils/bucketHelper');

class DashboardController {
    /**
     * Get product trends with bucket-based filtering
     * GET /dashboard/products
     */
    async getProducts(req, res) {
        try {
            const { startDate, endDate, bucket = 'day' } = req.query;
            
            // Validate bucket parameter
            if (!validateBucket(bucket)) {
                return res.status(400).json({ 
                    error: 'Invalid bucket parameter. Must be: day, week, or month' 
                });
            }
            
            // Validate date range if provided
            if (startDate && endDate && !validateDateRange(startDate, endDate)) {
                return res.status(400).json({ 
                    error: 'Invalid date range. StartDate must be before endDate and in YYYY-MM-DD format' 
                });
            }

            const result = await analyticsService.getProductTrends({
                startDate,
                endDate,
                bucket
            });

            res.json(result);
        } catch (error) {
            console.error('Dashboard products error:', error);
            res.status(500).json({ 
                error: 'Internal server error while fetching product trends' 
            });
        }
    }

    /**
     * Get visitor trends with bucket-based filtering
     * GET /dashboard/visitors
     */
    async getVisitors(req, res) {
        try {
            const { startDate, endDate, bucket = 'day' } = req.query;
            
            // Validate bucket parameter
            if (!validateBucket(bucket)) {
                return res.status(400).json({ 
                    error: 'Invalid bucket parameter. Must be: day, week, or month' 
                });
            }
            
            // Validate date range if provided
            if (startDate && endDate && !validateDateRange(startDate, endDate)) {
                return res.status(400).json({ 
                    error: 'Invalid date range. StartDate must be before endDate and in YYYY-MM-DD format' 
                });
            }

            const result = await analyticsService.getVisitorTrends({
                startDate,
                endDate,
                bucket
            });

            res.json(result);
        } catch (error) {
            console.error('Dashboard visitors error:', error);
            res.status(500).json({ 
                error: 'Internal server error while fetching visitor trends' 
            });
        }
    }
}

module.exports = new DashboardController();
