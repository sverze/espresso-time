import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { config } from "../config";

console.log('DynamoDB Config:', {
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  isLocal: config.isLocal,
  isAmplify: config.isAmplify,
  environment: config.environment
});

// Create DynamoDB client configuration based on environment
const clientConfig: { region: string; endpoint?: string; credentials?: { accessKeyId: string; secretAccessKey: string } } = {
  region: config.dynamodb.region,
};

// Add endpoint and credentials only for local development
if (config.isLocal && config.dynamodb.endpoint) {
  clientConfig.endpoint = config.dynamodb.endpoint;
}

if (config.dynamodb.credentials) {
  clientConfig.credentials = config.dynamodb.credentials;
}

console.log('Using DynamoDB client config:', {
  ...clientConfig,
  credentials: clientConfig.credentials ? 'set' : 'using default credential chain (IAM role)'
});

const dynamoDBClient = new DynamoDBClient(clientConfig);

// Create document client for easier item operations
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export { dynamoDBClient, docClient };