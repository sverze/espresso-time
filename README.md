# Espresso Time ☕

A comprehensive espresso tracking application built with Next.js, TypeScript, and DynamoDB. Track your espresso shots, analyze brewing patterns, and perfect your coffee-making skills.

## Features

- **Shot Tracking**: Record detailed espresso shot data including grinder settings, extraction times, and quality ratings
- **Analytics Dashboard**: Visualize your brewing patterns with interactive charts and statistics
- **Roast Management**: Manage different coffee beans and roasters
- **Performance Insights**: Analyze grinder settings, extraction ratios, and shot quality over time

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: DynamoDB (local development with DynamoDB Local)
- **Charts**: Recharts
- **Icons**: React Icons
- **Date Management**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker Desktop (for local DynamoDB)

### Local Development Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd espresso-time
   npm install
   ```

2. **Start Docker Desktop** (required for local DynamoDB)

3. **Start local DynamoDB:**
   ```bash
   npm run dynamodb:start
   ```
   This will start DynamoDB Local on `http://localhost:8000` and DynamoDB Admin UI on `http://localhost:8001`

4. **Initialize database tables:**
   ```bash
   npm run dynamodb:init
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **Open the application:**
   Visit [http://localhost:3000](http://localhost:3000) to start tracking your espresso shots!

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

The application uses the following environment variables (already configured in `.env.local`):

```env
# Local DynamoDB configuration
DYNAMODB_ENDPOINT=http://localhost:8000
DYNAMODB_REGION=us-east-1
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy

# Client-side environment variables (accessible in browser)
NEXT_PUBLIC_DYNAMODB_ENDPOINT=http://localhost:8000
NEXT_PUBLIC_DYNAMODB_REGION=us-east-1
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=dummy
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=dummy

# Environment
NODE_ENV=development
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes for DynamoDB operations
│   │   └── espresso-shots/ # Espresso shot CRUD endpoints
│   └── page.tsx           # Main dashboard page
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── api/              # Client-side API services
│   ├── dynamodb/         # DynamoDB services and schema
│   ├── config.ts         # Application configuration
│   ├── dataContext.tsx   # React context for data management
│   └── types.ts          # TypeScript type definitions
├── scripts/              # Setup and utility scripts
│   ├── init-dynamodb.ts  # Database initialization
│   ├── start-dynamodb.sh # DynamoDB startup script
│   └── stop-dynamodb.sh  # DynamoDB shutdown script
└── docker-compose.yml    # DynamoDB Local container config
```

## Database Schema

The application uses a single DynamoDB table `espresso-shots` with the following structure:

- **Primary Key**: `id` (String) - Unique identifier for each shot
- **Attributes**: roaster, roastName, roastDate, grinderSetting, grindTime, coffeeWeight, shotType, extractionTime, espressoWeight, qualityRating, usedMilk, tastingNotes, createdAt, updatedAt

## Troubleshooting

### DynamoDB Issues
- Ensure Docker Desktop is running
- Check that ports 8000 and 8001 are available
- Restart DynamoDB: `npm run dynamodb:stop && npm run dynamodb:start`

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
