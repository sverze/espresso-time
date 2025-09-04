import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";

console.log('DynamoDB Config:', {
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  isLocal: config.isLocal,
  env: config.environment
});

// Create DynamoDB client with forced local configuration for development
const clientConfig = config.isLocal ? {
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'dummy',
    secretAccessKey: 'dummy',
  },
} : {
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  credentials: {
    accessKeyId: config.dynamodb.accessKeyId,
    secretAccessKey: config.dynamodb.secretAccessKey,
  },
};

console.log('Using DynamoDB client config:', clientConfig);

const dynamoDBClient = new DynamoDBClient(clientConfig);

// Create document client for easier item operations
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export { dynamoDBClient, docClient };