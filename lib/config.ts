// Environment detection
const isLocal = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isAmplify = !!(process.env.REGION || process.env.AWS_REGION) && !!process.env.AWS_LAMBDA_FUNCTION_NAME;

export const config = {
  // Environment flags
  isLocal,
  isProduction,
  isAmplify,
  environment: process.env.NODE_ENV || 'development',

  // DynamoDB configuration
  dynamodb: {
    // For local: use localhost endpoint
    // For Amplify/AWS: use default endpoint (undefined)
    endpoint: isLocal 
      ? (process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000')
      : undefined,
    
    // AWS region
    region: process.env.REGION || process.env.AWS_REGION || process.env.DYNAMODB_REGION || 'us-east-1',
    
    // Credentials (only needed for local development)
    // In AWS, IAM roles handle authentication automatically
    credentials: isLocal ? {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
    } : undefined,
  },

  // Authentication configuration
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
    sessionTimeout: '24h',
    adminUsername: process.env.ADMIN_USERNAME || 'admin',
    adminPassword: process.env.ADMIN_PASSWORD || 'change-me-in-production',
  },
} as const;

export const TABLE_NAMES = {
  ESPRESSO_SHOTS: 'espresso-shots',
} as const;

// Helper function to get environment-specific table name
export const getTableName = (baseName: string): string => {
  const environment = config.isLocal ? 'local' : 'prod';
  return config.isLocal ? baseName : `${environment}-${baseName}`;
};