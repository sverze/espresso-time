import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  public readonly espressoShotsTable: dynamodb.Table;
  public readonly amplifyRole: iam.Role;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Table for Espresso Shots
    this.espressoShotsTable = new dynamodb.Table(this, 'EspressoShotsTable', {
      tableName: 'prod-espresso-shots',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development - change to RETAIN for production
      pointInTimeRecovery: true,
    });

    // Global Secondary Index for date-based queries
    this.espressoShotsTable.addGlobalSecondaryIndex({
      indexName: 'DateIndex',
      partitionKey: {
        name: 'dateTime',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Global Secondary Index for roaster and date queries
    this.espressoShotsTable.addGlobalSecondaryIndex({
      indexName: 'RoasterDateIndex',
      partitionKey: {
        name: 'roasterName',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'dateTime',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // IAM Role for Amplify with DynamoDB permissions
    this.amplifyRole = new iam.Role(this, 'AmplifyExecutionRole', {
      roleName: 'EspressoTimeAmplifyRole',
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
      description: 'Execution role for Espresso Time Amplify app to access DynamoDB',
    });

    // Grant read/write permissions to the DynamoDB table
    this.espressoShotsTable.grantReadWriteData(this.amplifyRole);

    // Add CloudWatch Logs permissions for Lambda function logging
    this.amplifyRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'logs:DescribeLogStreams',
        'logs:DescribeLogGroups',
      ],
      resources: ['*'],
    }));

    // Output the table name and role ARN for reference
    new cdk.CfnOutput(this, 'EspressoShotsTableName', {
      value: this.espressoShotsTable.tableName,
      description: 'Name of the Espresso Shots DynamoDB table',
      exportName: 'EspressoShotsTableName',
    });

    new cdk.CfnOutput(this, 'AmplifyRoleArn', {
      value: this.amplifyRole.roleArn,
      description: 'ARN of the Amplify execution role',
      exportName: 'AmplifyRoleArn',
    });

    new cdk.CfnOutput(this, 'EspressoShotsTableArn', {
      value: this.espressoShotsTable.tableArn,
      description: 'ARN of the Espresso Shots DynamoDB table',
      exportName: 'EspressoShotsTableArn',
    });
  }
}
