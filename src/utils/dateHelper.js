const moment = require('moment');

class DateHelper {
    /**
     * Format date to YYYY-MM-DD
     */
    static formatDate(date) {
        return moment(date).format('YYYY-MM-DD');
    }

    /**
     * Get current date in YYYY-MM-DD format
     */
    static getCurrentDate() {
        return moment().format('YYYY-MM-DD');
    }

    /**
     * Get date N days ago
     */
    static getDaysAgo(days) {
        return moment().subtract(days, 'days').format('YYYY-MM-DD');
    }

    /**
     * Check if date is valid
     */
    static isValidDate(dateString) {
        return moment(dateString, 'YYYY-MM-DD', true).isValid();
    }

    /**
     * Get start and end of week for given date
     */
    static getWeekBounds(date) {
        const momentDate = moment(date);
        return {
            start: momentDate.startOf('week').format('YYYY-MM-DD'),
            end: momentDate.endOf('week').format('YYYY-MM-DD')
        };
    }

    /**
     * Get start and end of month for given date
     */
    static getMonthBounds(date) {
        const momentDate = moment(date);
        return {
            start: momentDate.startOf('month').format('YYYY-MM-DD'),
            end: momentDate.endOf('month').format('YYYY-MM-DD')
        };
    }

    /**
     * Calculate difference between two dates in days
     */
    static daysDifference(startDate, endDate) {
        const start = moment(startDate);
        const end = moment(endDate);
        return end.diff(start, 'days');
    }
}

module.exports = DateHelper;
