import { NextRequest, NextResponse } from 'next/server';
import { authService } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    username: string;
    isAuthenticated: boolean;
  };
}

/**
 * Middleware to authenticate API requests
 */
export function withAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
      const token = authService.extractTokenFromHeader(authHeader ?? undefined);

      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Verify token
      const payload = authService.verifyToken(token);
      
      if (!payload) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      // Add user info to request
      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        username: payload.username,
        isAuthenticated: true
      };

      // Call the actual handler
      return handler(authenticatedRequest);

    } catch (error) {
      console.error('Authentication middleware error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  };
}

/**
 * Optional authentication - adds user info if token is valid, but doesn't block request
 */
export function withOptionalAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization');
      const token = authService.extractTokenFromHeader(authHeader ?? undefined);

      const authenticatedRequest = request as AuthenticatedRequest;

      if (token) {
        // Verify token
        const payload = authService.verifyToken(token);
        
        if (payload) {
          // Add user info to request
          authenticatedRequest.user = {
            username: payload.username,
            isAuthenticated: true
          };
        }
      }

      // Call the actual handler regardless of auth status
      return handler(authenticatedRequest);

    } catch (error) {
      console.error('Optional authentication middleware error:', error);
      // Continue with request even if auth fails
      return handler(request as AuthenticatedRequest);
    }
  };
}