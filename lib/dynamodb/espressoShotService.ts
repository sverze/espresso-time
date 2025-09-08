import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { docClient } from "./client";
import { DynamoEspressoShot } from "./schema";
import { TABLE_NAMES, getTableName } from "../config";
import { EspressoShot, EspressoShotFormData } from "../types";

export class EspressoShotService {
  private tableName = getTableName(TABLE_NAMES.ESPRESSO_SHOTS);

  constructor() {
    console.log('🔧 EspressoShotService initialized with table name:', this.tableName);
  }

  // Convert DynamoDB item to application format
  private fromDynamoItem(item: DynamoEspressoShot): EspressoShot {
    return {
      id: item.id,
      roasterName: item.roasterName,
      roastName: item.roastName,
      roastDate: item.roastDate,
      dateTime: item.dateTime,
      grinderSetting: item.grinderSetting,
      grindTime: item.grindTime,
      coffeeWeight: item.coffeeWeight,
      outputWeight: item.outputWeight,
      extractionTime: item.extractionTime,
      shotType: item.shotType,
      rating: item.rating,
      notes: item.notes,
      usedMilk: item.usedMilk,
      createdAt: item.createdAt,
    };
  }

  // Convert application format to DynamoDB item
  private toDynamoItem(shot: EspressoShot): DynamoEspressoShot {
    return {
      id: shot.id,
      roasterName: shot.roasterName,
      roastName: shot.roastName,
      roastDate: shot.roastDate,
      dateTime: shot.dateTime,
      grinderSetting: shot.grinderSetting,
      grindTime: shot.grindTime,
      coffeeWeight: shot.coffeeWeight,
      outputWeight: shot.outputWeight,
      extractionTime: shot.extractionTime,
      shotType: shot.shotType,
      rating: shot.rating,
      notes: shot.notes,
      usedMilk: shot.usedMilk,
      createdAt: shot.createdAt,
      updatedAt: new Date().toISOString(),
    };
  }

  // Create a new espresso shot
  async createShot(formData: EspressoShotFormData): Promise<EspressoShot> {
    const now = new Date().toISOString();
    const newShot: EspressoShot = {
      id: uuidv4(),
      ...formData,
      dateTime: now,
      createdAt: now,
    };

    const dynamoItem = this.toDynamoItem(newShot);

    try {
      await docClient.send(new PutCommand({
        TableName: this.tableName,
        Item: dynamoItem,
      }));

      return newShot;
    } catch (error) {
      console.error('Error creating espresso shot:', error);
      throw new Error('Failed to create espresso shot');
    }
  }

  // Get a single espresso shot by ID
  async getShot(id: string): Promise<EspressoShot | null> {
    try {
      const result = await docClient.send(new GetCommand({
        TableName: this.tableName,
        Key: { id },
      }));

      return result.Item ? this.fromDynamoItem(result.Item as DynamoEspressoShot) : null;
    } catch (error) {
      console.error('Error getting espresso shot:', error);
      throw new Error('Failed to get espresso shot');
    }
  }

  // Get all espresso shots
  async getAllShots(): Promise<EspressoShot[]> {
    try {
      const result = await docClient.send(new ScanCommand({
        TableName: this.tableName,
      }));

      return (result.Items || [])
        .map(item => this.fromDynamoItem(item as DynamoEspressoShot))
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    } catch (error) {
      console.error('Error getting all espresso shots:', error);
      throw new Error('Failed to get espresso shots');
    }
  }

  // Update an existing espresso shot
  async updateShot(id: string, formData: EspressoShotFormData): Promise<EspressoShot> {
    try {
      // First get the existing shot to preserve createdAt
      const existingShot = await this.getShot(id);
      if (!existingShot) {
        throw new Error('Espresso shot not found');
      }

      const updatedShot: EspressoShot = {
        ...existingShot,
        ...formData,
      };

      const dynamoItem = this.toDynamoItem(updatedShot);

      await docClient.send(new PutCommand({
        TableName: this.tableName,
        Item: dynamoItem,
      }));

      return updatedShot;
    } catch (error) {
      console.error('Error updating espresso shot:', error);
      throw new Error('Failed to update espresso shot');
    }
  }

  // Delete an espresso shot
  async deleteShot(id: string): Promise<void> {
    try {
      await docClient.send(new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      }));
    } catch (error) {
      console.error('Error deleting espresso shot:', error);
      throw new Error('Failed to delete espresso shot');
    }
  }

  // Get shots by roaster (using GSI)
  async getShotsByRoaster(roasterName: string): Promise<EspressoShot[]> {
    try {
      const result = await docClient.send(new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'roasterName = :roaster',
        ExpressionAttributeValues: {
          ':roaster': roasterName,
        },
      }));

      return (result.Items || [])
        .map(item => this.fromDynamoItem(item as DynamoEspressoShot))
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
    } catch (error) {
      console.error('Error getting shots by roaster:', error);
      throw new Error('Failed to get shots by roaster');
    }
  }
}

// Export singleton instance
export const espressoShotService = new EspressoShotService();