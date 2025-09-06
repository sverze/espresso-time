import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from './config';

export interface AuthUser {
  username: string;
  isAuthenticated: boolean;
}

export interface JWTPayload {
  username: string;
  iat: number;
  exp: number;
}

export class AuthService {
  private readonly jwtSecret: string;
  private readonly adminUsername: string;
  private readonly adminPassword: string;

  constructor() {
    this.jwtSecret = config.auth.jwtSecret;
    this.adminUsername = config.auth.adminUsername;
    this.adminPassword = config.auth.adminPassword;
    
    // Debug logging for deployment troubleshooting
    console.log('🔐 AuthService initialized:', {
      environment: process.env.NODE_ENV,
      hasJwtSecret: !!this.jwtSecret,
      jwtSecretLength: this.jwtSecret?.length || 0,
      hasAdminUsername: !!this.adminUsername,
      adminUsername: this.adminUsername, // Safe to log username
      hasAdminPassword: !!this.adminPassword,
      adminPasswordLength: this.adminPassword?.length || 0,
      isAmplify: !!(process.env.REGION || process.env.AWS_REGION),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Authenticate user with username and password
   */
  async authenticate(username: string, password: string): Promise<boolean> {
    // For now, we only support admin user with hardcoded credentials
    // In a real app, you'd hash passwords and store them in a database
    
    console.log('🔍 Authentication attempt:', {
      providedUsername: username,
      expectedUsername: this.adminUsername,
      usernameMatch: username === this.adminUsername,
      hasPassword: !!password,
      passwordLength: password?.length || 0,
      hasExpectedPassword: !!this.adminPassword,
      expectedPasswordLength: this.adminPassword?.length || 0,
      timestamp: new Date().toISOString()
    });
    
    const isValid = username === this.adminUsername && password === this.adminPassword;
    
    console.log('✅ Authentication result:', {
      success: isValid,
      timestamp: new Date().toISOString()
    });
    
    return isValid;
  }

  /**
   * Generate JWT token for authenticated user
   */
  generateToken(username: string): string {
    return jwt.sign(
      { username },
      this.jwtSecret,
      { expiresIn: config.auth.sessionTimeout }
    );
  }

  /**
   * Verify and decode JWT token
   */
  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      console.error('JWT verification failed:', error);
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7); // Remove "Bearer " prefix
  }

  /**
   * Hash password for storage (for future use)
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash (for future use)
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}

// Export singleton instance
export const authService = new AuthService();