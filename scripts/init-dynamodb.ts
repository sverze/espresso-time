#!/usr/bin/env tsx

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createTableCommands } from "../lib/dynamodb/schema";

// Hardcode local development configuration
const localConfig = {
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
};

async function initDynamoDB() {
  // Create DynamoDB client for local development
  const client = new DynamoDBClient(localConfig);

  console.log('🚀 Initializing DynamoDB tables...');
  console.log(`📍 Endpoint: ${localConfig.endpoint}`);

  try {
    // Create all tables
    for (const command of createTableCommands) {
      const tableName = command.input.TableName;
      console.log(`📋 Creating table: ${tableName}`);
      
      try {
        await client.send(command);
        console.log(`✅ Table ${tableName} created successfully`);
      } catch (error: any) {
        if (error.name === 'ResourceInUseException') {
          console.log(`⚠️  Table ${tableName} already exists`);
        } else {
          console.error(`❌ Error creating table ${tableName}:`, error);
          throw error;
        }
      }
    }

    console.log('🎉 DynamoDB initialization complete!');
    console.log('🔗 Access DynamoDB Admin at: http://localhost:8001');
  } catch (error) {
    console.error('💥 Failed to initialize DynamoDB:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  initDynamoDB();
}

export { initDynamoDB };