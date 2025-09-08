const moment = require('moment');

/**
 * Validate bucket parameter
 */
const validateBucket = (bucket) => {
    const validBuckets = ['day', 'week', 'month'];
    return validBuckets.includes(bucket);
};

/**
 * Validate date range
 */
const validateDateRange = (startDate, endDate) => {
    const start = moment(startDate, 'YYYY-MM-DD', true);
    const end = moment(endDate, 'YYYY-MM-DD', true);
    
    if (!start.isValid() || !end.isValid()) {
        return false;
    }
    
    return start.isSameOrBefore(end);
};

/**
 * Generate date buckets based on start date, end date, and bucket type
 */
const generateDateBuckets = (startDate, endDate, bucket) => {
    const start = moment(startDate);
    const end = moment(endDate);
    
    const buckets = [];
    let current = start.clone();
    
    // Align current to bucket boundaries
    switch (bucket) {
        case 'week':
            current = current.startOf('week');
            break;
        case 'month':
            current = current.startOf('month');
            break;
        default: // day
            current = current.startOf('day');
    }
    
    while (current.isSameOrBefore(end)) {
        buckets.push(current.clone());
        
        switch (bucket) {
            case 'week':
                current.add(1, 'week');
                break;
            case 'month':
                current.add(1, 'month');
                break;
            default: // day
                current.add(1, 'day');
        }
    }
    
    return buckets;
};

/**
 * Format bucket dates based on bucket type
 */
const formatBucketDates = (bucketStart, bucketType) => {
    let startDate, endDate;
    
    switch (bucketType) {
        case 'day':
            startDate = bucketStart.format('YYYY-MM-DD');
            endDate = bucketStart.format('YYYY-MM-DD');
            break;
        case 'week':
            startDate = bucketStart.startOf('week').format('YYYY-MM-DD');
            endDate = bucketStart.endOf('week').format('YYYY-MM-DD');
            break;
        case 'month':
            startDate = bucketStart.startOf('month').format('YYYY-MM-DD');
            endDate = bucketStart.endOf('month').format('YYYY-MM-DD');
            break;
        default:
            startDate = bucketStart.format('YYYY-MM-DD');
            endDate = bucketStart.format('YYYY-MM-DD');
    }
    
    return { startDate, endDate };
};

/**
 * Get date range for analytics (default last 30 days)
 */
const getDefaultDateRange = (days = 30) => {
    const endDate = moment().format('YYYY-MM-DD');
    const startDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
    
    return { startDate, endDate };
};

module.exports = {
    validateBucket,
    validateDateRange,
    generateDateBuckets,
    formatBucketDates,
    getDefaultDateRange
};
