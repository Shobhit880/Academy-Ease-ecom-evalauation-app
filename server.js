require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import your dashboard routes
const dashboardRoutes = require('./src/routes/dashboard');

const app = express();

// Enable pretty JSON formatting (THIS IS THE KEY LINE)
app.set('json spaces', 2);

// Security middleware
app.use(helmet());
app.use(cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Root route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce Analytics API', 
        status: 'Running',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            products: 'GET /dashboard/products',
            visitors: 'GET /dashboard/visitors',
            health: 'GET /health'
        }
    });
});

// Dashboard routes - IMPORTANT: This connects your routes
app.use('/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        service: 'E-commerce Analytics API',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())} seconds`,
        memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`
        }
    });
});

// 404 handler - MUST come after all other routes
app.use('*', (req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            'GET /',
            'GET /dashboard/products',
            'GET /dashboard/visitors', 
            'GET /dashboard/health',
            'GET /health'
        ],
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n🚀 Server started successfully!');
    console.log(`📊 E-commerce Analytics API`);
    console.log(`🌐 Server: http://localhost:${PORT}`);
    console.log('\n📋 Available Endpoints:');
    console.log(`   🏠 Root:      http://localhost:${PORT}/`);
    console.log(`   📈 Products:  http://localhost:${PORT}/dashboard/products`);
    console.log(`   👥 Visitors:  http://localhost:${PORT}/dashboard/visitors`);
    console.log(`   ❤️  Health:    http://localhost:${PORT}/health`);
    console.log('\n💡 Try with query parameters:');
    console.log(`   http://localhost:${PORT}/dashboard/products?startDate=2025-09-01&endDate=2025-09-03&bucket=day`);
    console.log('\n' + '='.repeat(80));
});

module.exports = app;
