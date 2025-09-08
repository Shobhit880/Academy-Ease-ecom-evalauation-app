const db = require('../config/database');

class ProductTrend {
    constructor(data) {
        this.id = data.id;
        this.date = data.date;
        this.totalProducts = data.total_products;
        this.productsAdded = data.products_added;
        this.productsRemoved = data.products_removed;
        this.createdAt = data.created_at;
        this.updatedAt = data.updated_at;
    }

    /**
     * Create a new product trend record
     */
    static async create(data) {
        const { date, totalProducts, productsAdded, productsRemoved } = data;
        
        const [result] = await db.execute(`
            INSERT INTO product_trends (date, total_products, products_added, products_removed)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                total_products = VALUES(total_products),
                products_added = VALUES(products_added),
                products_removed = VALUES(products_removed)
        `, [date, totalProducts, productsAdded, productsRemoved]);
        
        return result.insertId;
    }

    /**
     * Get trend data by date range
     */
    static async getByDateRange(startDate, endDate) {
        const [rows] = await db.execute(`
            SELECT * FROM product_trends 
            WHERE date BETWEEN ? AND ? 
            ORDER BY date ASC
        `, [startDate, endDate]);
        
        return rows.map(row => new ProductTrend(row));
    }

    /**
     * Get latest trend record
     */
    static async getLatest() {
        const [rows] = await db.execute(`
            SELECT * FROM product_trends 
            ORDER BY date DESC 
            LIMIT 1
        `);
        
        return rows.length > 0 ? new ProductTrend(rows[0]) : null;
    }

    /**
     * Update existing record
     */
    async update(data) {
        const { totalProducts, productsAdded, productsRemoved } = data;
        
        await db.execute(`
            UPDATE product_trends 
            SET total_products = ?, products_added = ?, products_removed = ?
            WHERE id = ?
        `, [totalProducts, productsAdded, productsRemoved, this.id]);
    }

    /**
     * Delete record
     */
    async delete() {
        await db.execute('DELETE FROM product_trends WHERE id = ?', [this.id]);
    }
}

module.exports = ProductTrend;
