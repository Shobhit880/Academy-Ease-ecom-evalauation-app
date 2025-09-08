const db = require('../config/database');

class VisitorLog {
    constructor(data) {
        this.id = data.id;
        this.userIp = data.user_ip;
        this.userAgent = data.user_agent;
        this.visitedAt = data.visited_at;
        this.pageUrl = data.page_url;
        this.sessionId = data.session_id;
        this.referrer = data.referrer;
        this.createdDate = data.created_date;
    }

    /**
     * Create a new visitor log entry
     */
    static async create(data) {
        const { userIp, userAgent, pageUrl, sessionId, referrer } = data;
        
        const [result] = await db.execute(`
            INSERT INTO visitor_logs (user_ip, user_agent, page_url, session_id, referrer)
            VALUES (?, ?, ?, ?, ?)
        `, [userIp, userAgent, pageUrl, sessionId, referrer]);
        
        return result.insertId;
    }

    /**
     * Get visitor logs by date range
     */
    static async getByDateRange(startDate, endDate) {
        const [rows] = await db.execute(`
            SELECT * FROM visitor_logs 
            WHERE created_date BETWEEN ? AND ? 
            ORDER BY visited_at DESC
        `, [startDate, endDate]);
        
        return rows.map(row => new VisitorLog(row));
    }

    /**
     * Get unique visitors count by date range
     */
    static async getUniqueVisitorsCount(startDate, endDate) {
        const [rows] = await db.execute(`
            SELECT COUNT(DISTINCT session_id) as count
            FROM visitor_logs 
            WHERE created_date BETWEEN ? AND ?
        `, [startDate, endDate]);
        
        return rows[0].count;
    }

    /**
     * Get visitor stats by date
     */
    static async getStatsByDate(date) {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total_visits,
                COUNT(DISTINCT session_id) as unique_visitors,
                COUNT(DISTINCT user_ip) as unique_ips
            FROM visitor_logs 
            WHERE created_date = ?
        `, [date]);
        
        return rows[0];
    }

    /**
     * Get recent visitors
     */
    static async getRecent(limit = 100) {
        const [rows] = await db.execute(`
            SELECT * FROM visitor_logs 
            ORDER BY visited_at DESC 
            LIMIT ?
        `, [limit]);
        
        return rows.map(row => new VisitorLog(row));
    }
}

module.exports = VisitorLog;
