
/**
 * Service class for making API calls to the backend
 */
export class ApiService {
  static baseUrl = 'http://localhost:5000/api';

  /**
   * Get sensor data from the backend
   */
  static async getSensorData() {
    try {
      const response = await fetch(`${this.baseUrl}/sensors`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }

  /**
   * Get recent activity data for visualizations
   * @param {string} period - The time period for data ('day', 'week', or 'month')
   */
  static async getActivityData(period) {
    try {
      const response = await fetch(`${this.baseUrl}/sensors/recent-activity?period=${period}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching activity data:', error);
      throw error;
    }
  }

  /**
   * Get all alerts with optional filtering
   * @param {Object} options - Filter options for alerts
   * @param {string} [options.status] - Filter by status ('active' or 'resolved')
   * @param {string} [options.type] - Filter by type ('fall_risk', 'fall_detected', or 'inactivity')
   * @param {string} [options.fromDate] - Filter by start date
   * @param {string} [options.toDate] - Filter by end date
   */
  static async getAlerts(options = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (options.status) queryParams.append('status', options.status);
      if (options.type) queryParams.append('type', options.type);
      if (options.fromDate) queryParams.append('fromDate', options.fromDate);
      if (options.toDate) queryParams.append('toDate', options.toDate);
      
      const url = `${this.baseUrl}/alerts?${queryParams.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching alerts:', error);
      throw error;
    }
  }

  /**
   * Update the status of an alert
   * @param {string} id - The alert ID
   * @param {string} status - The new status
   */
  static async updateAlertStatus(id, status) {
    try {
      const response = await fetch(`${this.baseUrl}/alerts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating alert:', error);
      throw error;
    }
  }

  /**
   * Get user profile data
   * @param {string} userId - The user ID
   */
  static async getUserProfile(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/users/profile/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
}
