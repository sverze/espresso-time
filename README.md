# Espresso Time ☕

A comprehensive espresso tracking application built with Next.js, TypeScript, and DynamoDB. Track your espresso shots, analyze brewing patterns, and perfect your coffee-making skills.

## Features

- **Shot Tracking**: Record detailed espresso shot data including grinder settings, extraction times, and quality ratings
- **Analytics Dashboard**: Visualize your brewing patterns with interactive charts and statistics
- **Roast Management**: Manage different coffee beans and roasters
- **Performance Insights**: Analyze grinder settings, extraction ratios, and shot quality over time
- **Secure Authentication**: JWT-based authentication for single-user access
- **AWS Ready**: Automatic deployment to AWS with CDK infrastructure

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: DynamoDB (local + AWS production)
- **Authentication**: JWT with bcrypt password hashing
- **Infrastructure**: AWS CDK (TypeScript)
- **Deployment**: AWS Amplify
- **Charts**: Recharts
- **Icons**: React Icons
- **Date Management**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker Desktop (for local DynamoDB)
- AWS CLI (for deployment)

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd espresso-time
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your settings:
   # - Set JWT_SECRET to a secure random string (32+ characters)
   # - Set ADMIN_USERNAME and ADMIN_PASSWORD for authentication
   ```

3. **Start Docker Desktop** (required for local DynamoDB)

4. **Start local DynamoDB:**
   ```bash
   npm run dynamodb:start
   ```
   This will start DynamoDB Local on `http://localhost:8000` and DynamoDB Admin UI on `http://localhost:8001`

5. **Initialize database tables:**
   ```bash
   npm run dynamodb:init
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000) and log in with the credentials from your `.env.local` file

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run dynamodb:start` - Start local DynamoDB with Docker Compose
- `npm run dynamodb:stop` - Stop local DynamoDB
- `npm run dynamodb:init` - Initialize DynamoDB tables
- `npm run dynamodb:admin` - Open DynamoDB Admin UI

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# DynamoDB Configuration
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_REGION=us-east-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
REGION=us-east-1

# Environment
NODE_ENV=development

# Authentication (Change these!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
```

**Security Note**: Change the default `JWT_SECRET` and `ADMIN_PASSWORD` values before deploying to production!

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints (login, verify)
│   │   └── espresso-shots/ # Espresso shot CRUD endpoints
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── LoginForm.tsx      # Authentication form
│   ├── ProtectedRoute.tsx # Route protection wrapper
│   └── ...                # Other UI components
├── infrastructure/        # AWS CDK infrastructure code
│   ├── lib/               # CDK stack definitions
│   │   └── infrastructure-stack.ts # DynamoDB + IAM setup
│   └── ...                # CDK configuration files
├── lib/                   # Utilities and services
│   ├── api/              # Client-side API services
│   ├── dynamodb/         # DynamoDB services and schema
│   ├── auth.ts           # Authentication utilities
│   ├── authContext.tsx   # Authentication context
│   ├── middleware.ts     # API route middleware
│   ├── config.ts         # Environment-aware configuration
│   ├── dataContext.tsx   # Data management context
│   └── types.ts          # TypeScript type definitions
├── scripts/              # Setup and utility scripts
└── docker-compose.yml    # DynamoDB Local container config
```

## Database Schema

The application uses a single DynamoDB table `espresso-shots` with:

- **Primary Key**: `id` (String) - Unique identifier for each shot
- **Global Secondary Indexes**:
  - `DateIndex` - For querying by date
  - `RoasterDateIndex` - For querying by roaster and date
- **Attributes**: roaster, roastName, roastDate, grinderSetting, grindTime, coffeeWeight, shotType, extractionTime, espressoWeight, qualityRating, usedMilk, tastingNotes, createdAt

## 🚀 AWS Deployment

### Step 1: Prepare Repository

```bash
# Commit all changes
git add .
git commit -m "Ready for AWS deployment"
git push origin main
```

### Step 2: Deploy Infrastructure

```bash
# Navigate to infrastructure directory
cd infrastructure

# Install CDK dependencies
npm install

# Configure AWS credentials (first time)
aws configure

# Bootstrap CDK (first time only)
npx cdk bootstrap

# Deploy infrastructure
npx cdk deploy
```

**Important**: Note the output values (table name, role ARN) for Amplify configuration.

### Step 3: Set Up AWS Amplify

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Select **"GitHub"** and authorize access
4. Choose your repository and `main` branch
5. **Configure Service Role**:
   - In app settings → General → App details
   - Edit "Service role" 
   - Select: `EspressoTimeAmplifyRole` (created by CDK)

### Step 4: Environment Variables

In Amplify console, add these environment variables:

```env
NODE_ENV=production
REGION=us-east-1
JWT_SECRET=your-super-secure-jwt-secret-key-here-make-it-long-and-random
ADMIN_USERNAME=your-desired-username
ADMIN_PASSWORD=your-secure-password-here
```

### Step 5: Deploy

1. Click **"Save and deploy"**
2. Monitor build logs for any issues
3. Access your app at the Amplify-provided URL
4. Log in with your configured credentials

## Architecture

### Local Development
- Next.js app → Local DynamoDB (Docker)
- No authentication required for API calls
- Mock data fallback if DynamoDB unavailable

### Production (AWS)
- Next.js app (Amplify) → DynamoDB (AWS)
- JWT authentication for all API routes
- IAM roles handle AWS permissions automatically
- Automatic environment detection

## Troubleshooting

### Local Development
- **DynamoDB Issues**: Ensure Docker Desktop is running, ports 8000/8001 available
- **Build Issues**: Clear cache with `rm -rf .next && npm run build`
- **Auth Issues**: Check `.env.local` has correct `JWT_SECRET` and credentials

### AWS Deployment
- **Build Fails**: Check Amplify build logs, verify environment variables
- **Auth Issues**: Ensure `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD` are set correctly
- **DynamoDB Issues**: Verify CDK deployed successfully, check Amplify service role permissions
- **404 Errors**: Ensure the correct service role (`EspressoTimeAmplifyRole`) is attached
- **Environment Variable Issues**: Use `REGION` instead of `AWS_REGION` (Amplify reserves `AWS_*` variables)

### Switching Between Environments
The app automatically detects the environment:
- `NODE_ENV=development` → Uses local DynamoDB
- `NODE_ENV=production` → Uses AWS DynamoDB

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Protected Routes**: All espresso data requires authentication
- **IAM Roles**: AWS permissions handled automatically
- **Environment Separation**: Local and production environments isolated

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [AWS CDK Guide](https://docs.aws.amazon.com/cdk/) - Infrastructure as Code
- [AWS Amplify Documentation](https://docs.amplify.aws/) - Deployment platform
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/dynamodb/) - NoSQL database
