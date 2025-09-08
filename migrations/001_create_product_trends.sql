-- Create product_trends table for tracking product analytics
CREATE TABLE IF NOT EXISTS product_trends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    total_products INT NOT NULL DEFAULT 0,
    products_added INT NOT NULL DEFAULT 0,
    products_removed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ensure unique date entries
    UNIQUE KEY unique_date (date),
    
    -- Index for efficient date range queries
    INDEX idx_product_trends_date (date),
    INDEX idx_product_trends_created_at (created_at)
);

-- Insert sample data for testing
INSERT INTO product_trends (date, total_products, products_added, products_removed) VALUES
('2025-09-01', 120, 5, 2),
('2025-09-02', 123, 3, 0),
('2025-09-03', 128, 6, 1),
('2025-09-04', 125, 2, 5),
('2025-09-05', 130, 8, 3)
ON DUPLICATE KEY UPDATE 
    total_products = VALUES(total_products),
    products_added = VALUES(products_added),
    products_removed = VALUES(products_removed);
