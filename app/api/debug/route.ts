import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🔧 DEBUG API called at:', new Date().toISOString());
  console.log('🔧 Environment variables check:', {
    nodeEnv: process.env.NODE_ENV,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    adminUsername: process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasJwtSecret: !!process.env.JWT_SECRET,
    isAmplify: !!(process.env.REGION || process.env.AWS_REGION),
    awsRegion: process.env.AWS_REGION,
    region: process.env.REGION,
    lambdaFunction: process.env.AWS_LAMBDA_FUNCTION_NAME,
  });

  try {
    return NextResponse.json({
      success: true,
      message: 'Debug API working',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasAdminUsername: !!process.env.ADMIN_USERNAME,
        adminUsername: process.env.ADMIN_USERNAME,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD,
        hasJwtSecret: !!process.env.JWT_SECRET,
        isAmplify: !!(process.env.REGION || process.env.AWS_REGION),
      }
    });
  } catch (error) {
    console.error('🔧 DEBUG API error:', error);
    return NextResponse.json(
      { error: 'Debug API failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('🔧 DEBUG POST API called at:', new Date().toISOString());
  
  try {
    const body = await request.json();
    console.log('🔧 DEBUG POST body received:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Debug POST API working',
      receivedBody: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('🔧 DEBUG POST API error:', error);
    return NextResponse.json(
      { error: 'Debug POST API failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}