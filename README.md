# 🛒 E-commerce Analytics Dashboard

A Node.js Express application that provides real-time analytics for e-commerce product trends and visitor tracking with bucket-based filtering and date range support.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 📋 Table of Contents

- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- 📊 **Product Analytics**: Track product trends with additions, removals, and totals
- 👥 **Visitor Tracking**: Monitor unique visitors with session-based analytics  
- 🗓️ **Bucket Filtering**: Aggregate data by day, week, or month
- 📅 **Date Range Support**: Filter analytics by custom date ranges
- 🔄 **Real-time Data**: Get current totals and historical trends
- ✅ **Input Validation**: Comprehensive parameter validation and error handling
- 🎨 **Pretty JSON**: Formatted JSON responses for better readability
- 🏥 **Health Monitoring**: Built-in health check endpoints

## 🚀 API Endpoints

### Products Analytics

GET /dashboard/products

text
- **Query Parameters**: `startDate`, `endDate`, `bucket` (day/week/month)
- **Response**: Current product total + trend data

### Visitors Analytics  
GET /dashboard/visitors

text
- **Query Parameters**: `startDate`, `endDate`, `bucket` (day/week/month)
- **Response**: Total visitors + visitor bucket data

### Health Check
GET /health

text
- **Response**: Server status and uptime information

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Clone Repository
git clone [https://github.com/your-username/ecom-evaluation-app.git](https://github.com/Shobhit880/Academy-Ease-ecom-evalauation-app.git)
cd ecom-evaluation-app

text

### Install Dependencies
npm install

text

### Database Setup
1. Create MySQL database:
CREATE DATABASE ecommerce_analytics;

text

2. Run migrations:
mysql -u root -p ecommerce_analytics < migrations/001_create_product_trends.sql
mysql -u root -p ecommerce_analytics < migrations/002_create_visitor_logs.sql

text

### Environment Configuration
Create a `.env` file in the root directory:
Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=My_password
DB_NAME=ecommerce_analytics

Server Configuration
PORT=3000
NODE_ENV=development

text

### Start the Application
Development mode
npm start

Or with nodemon for auto-reload
npm run dev

text

The server will start at `http://localhost:3000`

## 📖 Usage

### Basic API Calls

**Get all product trends:**
curl http://localhost:3000/dashboard/products

text

**Get visitor data with date filter:**
curl "http://localhost:3000/dashboard/visitors?startDate=2025-09-01&endDate=2025-09-05&bucket=day"

text

**Check server health:**
curl http://localhost:3000/health

text

## 📚 API Documentation

### Products Endpoint

#### Request
GET /dashboard/products?startDate=2025-09-01&endDate=2025-09-03&bucket=day

text

#### Response
{
"currentTotal": 128,
"trend": [
{
"startDate": "2025-09-01",
"endDate": "2025-09-01",
"totalProducts": 120,
"productsAdded": 5,
"productsRemoved": 2
},
{
"startDate": "2025-09-02",
"endDate": "2025-09-02",
"totalProducts": 123,
"productsAdded": 3,
"productsRemoved": 0
}
]
}

text

### Visitors Endpoint

#### Request
GET /dashboard/visitors?startDate=2025-09-01&endDate=2025-09-03&bucket=day

text

#### Response
{
"totalVisitors": 452,
"visitorsByBucket": [
{
"startDate": "2025-09-01",
"endDate": "2025-09-01",
"visitors": 120
},
{
"startDate": "2025-09-02",
"endDate": "2025-09-02",
"visitors": 150
}
]
}

text

### Query Parameters

| Parameter | Type   | Required | Format     | Options          | Description |
|-----------|--------|----------|------------|------------------|-------------|
| startDate | String | Optional | YYYY-MM-DD | -                | Filter start date |
| endDate   | String | Optional | YYYY-MM-DD | -                | Filter end date |
| bucket    | String | Optional | -          | day, week, month | Aggregation period |

## 🗄️ Database Schema

### product_trends Table
CREATE TABLE product_trends (
id INT AUTO_INCREMENT PRIMARY KEY,
date DATE NOT NULL,
total_products INT NOT NULL DEFAULT 0,
products_added INT NOT NULL DEFAULT 0,
products_removed INT NOT NULL DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY unique_date (date),
INDEX idx_product_trends_date (date)
);

text

### visitor_logs Table
CREATE TABLE visitor_logs (
id INT AUTO_INCREMENT PRIMARY KEY,
user_ip VARCHAR(45) NOT NULL,
user_agent TEXT,
visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
page_url VARCHAR(500),
session_id VARCHAR(100) NOT NULL,
referrer VARCHAR(500),
created_date DATE GENERATED ALWAYS AS (DATE(visited_at)) STORED,
INDEX idx_visitor_logs_date (created_date),
INDEX idx_visitor_logs_session (session_id)
);

text

## 📁 Project Structure

ecom-evaluation-app/
├── src/
│ ├── config/
│ │ ├── database.js # Database connection
│ │ └── config.js # App configuration
│ ├── controllers/
│ │ └── dashboardController.js # Request handlers
│ ├── routes/
│ │ └── dashboard.js # API routes
│ ├── services/
│ │ └── analyticsService.js # Business logic
│ ├── middlewares/
│ │ ├── validation.js # Input validation
│ │ └── errorHandler.js # Error handling
│ ├── models/
│ │ ├── ProductTrend.js # Product model
│ │ └── VisitorLog.js # Visitor model
│ └── utils/
│ ├── bucketHelper.js # Date bucket utilities
│ └── dateHelper.js # Date utilities
├── migrations/
│ ├── 001_create_product_trends.sql
│ └── 002_create_visitor_logs.sql
├── server.js # Main application file
├── package.json # Dependencies and scripts
├── .env # Environment variables
├── .gitignore # Git ignore rules
├── README.md # Project documentation
└── Implementation.md # Technical implementation details

text

## 🔧 Environment Variables

| Variable    | Description           | Default     |
|-------------|-----------------------|-------------|
| PORT        | Server port          | 3000        |
| DB_HOST     | Database host        | localhost   |
| DB_PORT     | Database port        | 3306        |
| DB_USER     | Database username    | root        |
| DB_PASSWORD | Database password    | -           |
| DB_NAME     | Database name        | ecommerce_analytics |
| NODE_ENV    | Environment mode     | development |

## 🧪 Testing

### Manual Testing
Test products endpoint
curl "http://localhost:3000/dashboard/products"

Test visitors endpoint with parameters
curl "http://localhost:3000/dashboard/visitors?bucket=week"

Test health endpoint
curl "http://localhost:3000/health"

text

### Expected Response Codes
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Route not found
- `500` - Internal server error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [Shobhit880](https://github.com/Shobhit880)
- Email: 2k22aiml.ng2.2213142@gmail.com

## 🙏 Acknowledgments

- Express.js team for the excellent web framework
- MySQL team for the robust database system
- Node.js community for continuous support

---

**Built By Shobhit for e-commerce analytics**
