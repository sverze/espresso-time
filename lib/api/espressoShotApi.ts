import { EspressoShot } from '../dynamodb/espressoShotService';

export class EspressoShotAPI {
  private baseUrl = '/api/espresso-shots';

  async getAllShots(): Promise<EspressoShot[]> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting espresso shots via API:', error);
      throw new Error('Failed to get espresso shots');
    }
  }

  async createShot(shotData: Omit<EspressoShot, 'id' | 'createdAt' | 'updatedAt'>): Promise<EspressoShot> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shotData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating espresso shot via API:', error);
      throw new Error('Failed to create espresso shot');
    }
  }
}