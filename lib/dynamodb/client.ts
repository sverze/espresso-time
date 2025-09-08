import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromContainerMetadata, fromNodeProviderChain } from "@aws-sdk/credential-providers";
import type { AwsCredentialIdentityProvider } from "@aws-sdk/types";
import { config } from "../config";

console.log('DynamoDB Config:', {
  endpoint: config.dynamodb.endpoint,
  region: config.dynamodb.region,
  isLocal: config.isLocal,
  isAmplify: config.isAmplify,
  environment: config.environment
});

// Create DynamoDB client configuration based on environment
const clientConfig: { 
  region: string; 
  endpoint?: string; 
  credentials?: AwsCredentialIdentityProvider | { accessKeyId: string; secretAccessKey: string };
} = {
  region: config.dynamodb.region,
};

// Add endpoint and credentials only for local development
if (config.isLocal && config.dynamodb.endpoint) {
  clientConfig.endpoint = config.dynamodb.endpoint;
  // For local development, use static credentials
  if (config.dynamodb.credentials) {
    clientConfig.credentials = config.dynamodb.credentials;
  }
} else {
  // For AWS/Amplify environment, use explicit credential providers with retry logic
  try {
    // First try container metadata (ECS/Lambda/Fargate)
    clientConfig.credentials = fromContainerMetadata({
      maxRetries: 5,
      timeout: 5000, // 5 seconds
    });
    console.log('Using container metadata credentials provider');
  } catch (error) {
    // Fallback to node provider chain
    console.log('Container metadata failed, using node provider chain:', error);
    clientConfig.credentials = fromNodeProviderChain({
      maxRetries: 3,
    });
  }
}

console.log('Using DynamoDB client config:', {
  region: clientConfig.region,
  endpoint: clientConfig.endpoint || 'default AWS endpoint',
  credentials: clientConfig.credentials ? 'explicit credential provider configured' : 'using IAM role',
  isLocal: config.isLocal,
  isAmplify: config.isAmplify,
});

const dynamoDBClient = new DynamoDBClient(clientConfig);

// Create document client for easier item operations
const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

export { dynamoDBClient, docClient };