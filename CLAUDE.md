# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production 
- `npm run lint` - Run ESLint
- `npm run dynamodb:start` - Start local DynamoDB with Docker Compose
- `npm run dynamodb:stop` - Stop local DynamoDB
- `npm run dynamodb:init` - Initialize DynamoDB tables (run after starting DynamoDB)
- `npm run dynamodb:admin` - Open DynamoDB Admin UI at http://localhost:8001

## Local Development Setup

1. Start Docker Desktop (required for local DynamoDB)
2. Copy `.env.example` to `.env.local` and configure:
   - `JWT_SECRET` - secure random string (32+ characters)
   - `ADMIN_USERNAME` and `ADMIN_PASSWORD` for authentication
3. Run `npm run dynamodb:start` to start DynamoDB
4. Run `npm run dynamodb:init` to create tables
5. Run `npm run dev` to start the app

## Architecture Overview

This is a Next.js 15 espresso tracking application with the following key architectural patterns:

### Environment-Aware Configuration (`lib/config.ts`)
- **Local Development**: Uses DynamoDB Local (Docker) with dummy credentials
- **Production/AWS**: Uses AWS DynamoDB with IAM roles for authentication
- Auto-detects environment via `NODE_ENV` and AWS environment variables

### Authentication System
- **JWT-based auth** with bcrypt password hashing
- **Single admin user** (configurable via environment variables)
- **Middleware pattern** (`lib/middleware.ts`) with `withAuth()` and `withOptionalAuth()` wrappers
- **Context-based auth state** (`lib/authContext.tsx`) for React components

### DynamoDB Integration
- **Single table design**: `espresso-shots` table with GSI indexes
- **Service layer**: `lib/dynamodb/espressoShotService.ts` handles all data operations
- **Schema management**: `lib/dynamodb/schema.ts` defines table creation commands
- **Environment-specific table names**: Local uses base names, production uses prefixed names

### Component Architecture
- **Context-driven state management**: `lib/dataContext.tsx` manages espresso shot data
- **Protected routing**: `components/ProtectedRoute.tsx` wraps authenticated pages
- **Modal-based forms**: `components/AddEspressoShotForm.tsx` for data entry
- **Tab-based UI**: Dashboard, Entries, and Insights views

### API Routes (Next.js App Router)
- `app/api/auth/login/route.ts` - JWT token generation
- `app/api/auth/verify/route.ts` - Token verification
- `app/api/espresso-shots/route.ts` - CRUD operations (requires authentication)

### Data Flow
1. **Authentication**: Login → JWT token → stored in React context
2. **Data fetching**: Protected API routes → DynamoDB service → React context
3. **State management**: Context provides data to all components
4. **Forms**: Modal forms → API routes → DynamoDB → context refresh

### Infrastructure
- **AWS CDK**: `infrastructure/lib/infrastructure-stack.ts` defines DynamoDB table and IAM roles
- **Amplify deployment**: Automatic builds with environment-specific configuration
- **Docker Compose**: Local DynamoDB setup with admin UI

## Key Patterns

### Environment Detection
```typescript
// Always use lib/config.ts for environment-aware settings
import { config } from './lib/config';
const isLocal = config.isLocal;
const dynamoEndpoint = config.dynamodb.endpoint;
```

### Authentication Middleware
```typescript
// For protected API routes
import { withAuth } from '../../lib/middleware';
export const GET = withAuth(async (request) => { ... });
```

### DynamoDB Operations  
```typescript
// Always use the service layer
import { espressoShotService } from '../lib/dynamodb/espressoShotService';
const shots = await espressoShotService.getAllShots();
```

### TypeScript Types
Core types are defined in `lib/types.ts`:
- `EspressoShot` - Main data model
- `EspressoShotFormData` - Form input structure  
- `DashboardStats` - Analytics data structure

## Testing

No specific test framework is configured. When adding tests, check the project for existing test setup or ask the user for preferred testing approach.

## Common Gotchas

- **DynamoDB Local**: Must run `npm run dynamodb:start` before development
- **Environment Variables**: Production uses `REGION` not `AWS_REGION` (Amplify reserves AWS_* variables)
- **Table Names**: Local uses base names, production auto-prefixes with environment
- **Authentication**: All `/api/espresso-shots` endpoints require JWT authentication
- **Docker**: DynamoDB Local requires Docker Desktop to be running