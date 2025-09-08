-- Create visitor_logs table for tracking visitor analytics
CREATE TABLE IF NOT EXISTS visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_ip VARCHAR(45) NOT NULL,
    user_agent TEXT,
    visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    page_url VARCHAR(500),
    session_id VARCHAR(100) NOT NULL,
    referrer VARCHAR(500),
    
    -- Generated column for date-based queries
    created_date DATE GENERATED ALWAYS AS (DATE(visited_at)) STORED,
    
    -- Indexes for efficient queries
    INDEX idx_visitor_logs_date (created_date),
    INDEX idx_visitor_logs_timestamp (visited_at),
    INDEX idx_visitor_logs_session (session_id),
    INDEX idx_visitor_logs_ip (user_ip)
);

-- Insert sample data for testing
INSERT INTO visitor_logs (user_ip, user_agent, page_url, session_id, referrer, visited_at) VALUES
('192.168.1.100', 'Mozilla/5.0 Chrome/91.0', '/products', 'sess_001', 'https://google.com', '2025-09-01 10:30:00'),
('192.168.1.101', 'Mozilla/5.0 Firefox/89.0', '/home', 'sess_002', 'https://facebook.com', '2025-09-01 11:45:00'),
('192.168.1.102', 'Mozilla/5.0 Safari/14.1', '/cart', 'sess_003', 'direct', '2025-09-02 09:15:00'),
('192.168.1.103', 'Mozilla/5.0 Chrome/91.0', '/products', 'sess_004', 'https://twitter.com', '2025-09-02 14:20:00'),
('192.168.1.104', 'Mozilla/5.0 Edge/91.0', '/checkout', 'sess_005', 'https://google.com', '2025-09-03 16:30:00');
