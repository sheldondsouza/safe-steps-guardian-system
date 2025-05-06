
/**
 * Service class for making API calls to the backend
 */
export class ApiService {
  private static baseUrl = 'http://localhost:5000/api';

  /**
   * Get sensor data from the backend
   */
  public static async getSensorData() {
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
   * @param period - The time period for data ('day', 'week', or 'month')
   */
  public static async getActivityData(period: 'day' | 'week' | 'month') {
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
   * @param options - Filter options for alerts
   */
  public static async getAlerts(options: {
    status?: 'active' | 'resolved';
    type?: 'fall_risk' | 'fall_detected' | 'inactivity';
    fromDate?: string;
    toDate?: string;
  } = {}) {
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
   * @param id - The alert ID
   * @param status - The new status
   */
  public static async updateAlertStatus(id: string, status: 'active' | 'resolved') {
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
   * @param userId - The user ID
   */
  public static async getUserProfile(userId: string) {
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
