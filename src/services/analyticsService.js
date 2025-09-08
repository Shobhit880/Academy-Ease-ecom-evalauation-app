const db = require('../config/database');
const { generateDateBuckets, formatBucketDates } = require('../utils/bucketHelper');
const moment = require('moment');

class AnalyticsService {
    /**
     * Get product trends data with bucket aggregation
     */
    async getProductTrends({ startDate, endDate, bucket }) {
        try {
            // Get current total products (you might need to adjust this query based on your existing schema)
            const currentTotal = await this.getCurrentProductCount();
            
            // Set default date range if not provided
            const start = startDate || moment().subtract(30, 'days').format('YYYY-MM-DD');
            const end = endDate || moment().format('YYYY-MM-DD');
            
            // Generate date buckets based on the specified bucket type
            const buckets = generateDateBuckets(start, end, bucket);
            
            // Get trend data for each bucket
            const trend = await this.getProductTrendData(buckets, bucket);
            
            return {
                currentTotal,
                trend
            };
        } catch (error) {
            throw new Error(`Error fetching product trends: ${error.message}`);
        }
    }

    /**
     * Get visitor trends data with bucket aggregation
     */
    async getVisitorTrends({ startDate, endDate, bucket }) {
        try {
            // Set default date range if not provided
            const start = startDate || moment().subtract(30, 'days').format('YYYY-MM-DD');
            const end = endDate || moment().format('YYYY-MM-DD');
            
            // Get total visitors in the specified date range
            const totalVisitors = await this.getTotalVisitors(start, end);
            
            // Generate date buckets based on the specified bucket type
            const buckets = generateDateBuckets(start, end, bucket);
            
            // Get visitor data for each bucket
            const visitorsByBucket = await this.getVisitorBucketData(buckets, bucket);
            
            return {
                totalVisitors,
                visitorsByBucket
            };
        } catch (error) {
            throw new Error(`Error fetching visitor trends: ${error.message}`);
        }
    }

    /**
     * Get current total product count
     * Note: You might need to adjust this query based on your existing products table schema
     */
    async getCurrentProductCount() {
        try {
            const [rows] = await db.execute(`
                SELECT total_products as total 
                FROM product_trends 
                ORDER BY date DESC 
                LIMIT 1
            `);
            return rows.length > 0 ? rows[0].total : 0;
        } catch (error) {
            console.error('Error getting current product count:', error);
            return 0;
        }
    }

    /**
     * Get product trend data for specified buckets
     */
    async getProductTrendData(buckets, bucketType) {
        const trend = [];
        
        for (const bucket of buckets) {
            const { startDate, endDate } = formatBucketDates(bucket, bucketType);
            
            const [rows] = await db.execute(`
                SELECT 
                    COALESCE(AVG(total_products), 0) as totalProducts,
                    COALESCE(SUM(products_added), 0) as productsAdded,
                    COALESCE(SUM(products_removed), 0) as productsRemoved
                FROM product_trends 
                WHERE date BETWEEN ? AND ?
            `, [startDate, endDate]);

            const data = rows[0] || { totalProducts: 0, productsAdded: 0, productsRemoved: 0 };

            trend.push({
                startDate,
                endDate,
                totalProducts: parseInt(data.totalProducts) || 0,
                productsAdded: parseInt(data.productsAdded) || 0,
                productsRemoved: parseInt(data.productsRemoved) || 0
            });
        }
        
        return trend;
    }

    /**
     * Get visitor data for specified buckets
     */
    async getVisitorBucketData(buckets, bucketType) {
        const visitorsByBucket = [];
        
        for (const bucket of buckets) {
            const { startDate, endDate } = formatBucketDates(bucket, bucketType);
            
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT session_id) as visitors
                FROM visitor_logs 
                WHERE created_date BETWEEN ? AND ?
            `, [startDate, endDate]);

            const visitors = rows[0]?.visitors || 0;

            visitorsByBucket.push({
                startDate,
                endDate,
                visitors: parseInt(visitors)
            });
        }
        
        return visitorsByBucket;
    }

    /**
     * Get total unique visitors in date range
     */
    async getTotalVisitors(startDate, endDate) {
        try {
            const [rows] = await db.execute(`
                SELECT COUNT(DISTINCT session_id) as total
                FROM visitor_logs 
                WHERE created_date BETWEEN ? AND ?
            `, [startDate, endDate]);
            
            return parseInt(rows[0]?.total) || 0;
        } catch (error) {
            console.error('Error getting total visitors:', error);
            return 0;
        }
    }
}

module.exports = new AnalyticsService();
