export const config = {
  dynamodb: {
    endpoint: process.env.NEXT_PUBLIC_DYNAMODB_ENDPOINT || process.env.DYNAMODB_ENDPOINT,
    region: process.env.NEXT_PUBLIC_DYNAMODB_REGION || process.env.DYNAMODB_REGION || 'us-east-1',
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || 'dummy',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
  },
  environment: process.env.NODE_ENV || 'development',
  isLocal: process.env.NODE_ENV === 'development',
} as const;

export const TABLE_NAMES = {
  ESPRESSO_SHOTS: 'espresso-shots',
} as const;