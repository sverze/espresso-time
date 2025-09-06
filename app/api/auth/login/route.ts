import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  console.log('🚀 Login API route called at:', new Date().toISOString());
  console.log('🌍 Environment check:', {
    nodeEnv: process.env.NODE_ENV,
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPassword: !!process.env.ADMIN_PASSWORD,
    hasJwtSecret: !!process.env.JWT_SECRET,
    adminUsername: process.env.ADMIN_USERNAME, // Safe to log
    isAmplify: !!(process.env.REGION || process.env.AWS_REGION)
  });
  
  try {
    console.log('📦 Parsing request body...');
    const { username, password } = await request.json();
    
    console.log('📝 Login attempt details:', {
      providedUsername: username,
      hasPassword: !!password,
      passwordLength: password?.length || 0,
      timestamp: new Date().toISOString()
    });

    if (!username || !password) {
      console.log('❌ Missing credentials');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('🔐 Calling authService.authenticate...');
    // Authenticate user
    const isValidUser = await authService.authenticate(username, password);
    console.log('✅ AuthService authenticate result:', isValidUser);
    
    if (!isValidUser) {
      console.log('❌ Authentication failed - returning 401');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('🎟️ Generating JWT token...');
    // Generate JWT token
    const token = authService.generateToken(username);
    console.log('✅ JWT token generated successfully');

    console.log('🎉 Login successful - returning success response');
    return NextResponse.json({
      success: true,
      token,
      user: { username, isAuthenticated: true }
    });

  } catch (error) {
    console.error('💥 Login error occurred:', error);
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack available');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}