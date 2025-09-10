import { EspressoShot, EspressoShotFormData } from '../types';

export class EspressoShotAPI {
  private baseUrl = '/api/espresso-shots';

  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' ? localStorage.getItem('espresso-time-token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getAllShots(): Promise<EspressoShot[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting espresso shots via API:', error);
      throw error;
    }
  }

  async createShot(shotData: EspressoShotFormData): Promise<EspressoShot> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(shotData),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating espresso shot via API:', error);
      throw error;
    }
  }

  async deleteShot(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting espresso shot via API:', error);
      throw error;
    }
  }
}