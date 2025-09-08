const { validateBucket, validateDateRange } = require('../utils/bucketHelper');

/**
 * Validate query parameters for dashboard endpoints
 */
const validateQueryParams = (req, res, next) => {
    const { startDate, endDate, bucket } = req.query;
    
    // Validate bucket if provided
    if (bucket && !validateBucket(bucket)) {
        return res.status(400).json({
            error: 'Invalid bucket parameter',
            message: 'Bucket must be one of: day, week, month'
        });
    }
    
    // Validate date format and range if provided
    if (startDate || endDate) {
        // Check if both dates are provided when one is given
        if ((startDate && !endDate) || (!startDate && endDate)) {
            return res.status(400).json({
                error: 'Invalid date range',
                message: 'Both startDate and endDate must be provided together'
            });
        }
        
        // Validate date format and range
        if (startDate && endDate && !validateDateRange(startDate, endDate)) {
            return res.status(400).json({
                error: 'Invalid date range',
                message: 'Dates must be in YYYY-MM-DD format and startDate must be before or equal to endDate'
            });
        }
    }
    
    next();
};

/**
 * Validate required parameters
 */
const validateRequiredParams = (requiredParams) => {
    return (req, res, next) => {
        const missingParams = requiredParams.filter(param => !req.body[param] && !req.query[param] && !req.params[param]);
        
        if (missingParams.length > 0) {
            return res.status(400).json({
                error: 'Missing required parameters',
                missing: missingParams
            });
        }
        
        next();
    };
};

module.exports = {
    validateQueryParams,
    validateRequiredParams
};
