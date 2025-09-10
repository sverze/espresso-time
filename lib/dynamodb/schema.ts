import { CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { TABLE_NAMES } from "../config";

export const createTableCommands = [
  new CreateTableCommand({
    TableName: TABLE_NAMES.ESPRESSO_SHOTS,
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH', // Partition key
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S', // String
      },
      {
        AttributeName: 'dateTime',
        AttributeType: 'S', // String (ISO date)
      },
      {
        AttributeName: 'roasterName',
        AttributeType: 'S', // String
      },
    ],
    // Global Secondary Indexes for efficient querying
    GlobalSecondaryIndexes: [
      {
        IndexName: 'DateIndex',
        KeySchema: [
          {
            AttributeName: 'dateTime',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
      {
        IndexName: 'RoasterDateIndex',
        KeySchema: [
          {
            AttributeName: 'roasterName',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'dateTime',
            KeyType: 'RANGE', // Sort key
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
      },
    ],
    BillingMode: 'PAY_PER_REQUEST', // On-demand pricing
  }),
];

// DynamoDB item structure for EspressoShot
export interface DynamoEspressoShot {
  id: string;                    // Primary key
  roasterName: string;           // GSI partition key
  roastName: string;
  roastDate?: string;
  dateTime: string;              // ISO string, GSI sort key
  grinderSetting: number;
  grindTime?: number;
  coffeeWeight: number;
  outputWeight: number;
  extractionTime: number;
  shotType: 'Single' | 'Double' | 'Lungo';
  rating: number;
  notes: string;
  usedMilk?: boolean;
  frothLevel?: number;           // 0-8, only relevant when usedMilk is true
  createdAt: string;             // ISO string
  updatedAt: string;             // ISO string
}