#!/bin/bash

# Start local DynamoDB with Docker Compose
echo "Starting local DynamoDB..."
docker-compose up -d

echo "DynamoDB Local running on: http://localhost:8000"
echo "DynamoDB Admin UI available at: http://localhost:8001"
echo ""
echo "To stop DynamoDB Local, run: npm run dynamodb:stop"