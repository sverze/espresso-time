#!/bin/bash

# Stop local DynamoDB
echo "Stopping local DynamoDB..."
docker-compose down

echo "DynamoDB Local stopped."