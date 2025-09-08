/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    // Database connection errors
    if (err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
        return res.status(500).json({
            error: 'Database connection failed',
            message: 'Unable to connect to the database'
        });
    }
    
    // MySQL errors
    if (err.code && err.code.startsWith('ER_')) {
        return res.status(500).json({
            error: 'Database error',
            message: 'A database error occurred'
        });
    }
    
    // Validation errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation error',
            message: err.message
        });
    }
    
    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal server error' : message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;
