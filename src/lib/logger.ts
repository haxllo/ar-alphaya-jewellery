import { NextRequest } from 'next/server';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

// Log entry interface
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  url?: string;
  method?: string;
}

// Security event types
export enum SecurityEventType {
  AUTHENTICATION_FAILED = 'authentication_failed',
  AUTHORIZATION_DENIED = 'authorization_denied',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  INVALID_INPUT = 'invalid_input',
  PAYMENT_SIGNATURE_INVALID = 'payment_signature_invalid',
  CSRF_TOKEN_INVALID = 'csrf_token_invalid',
  FILE_UPLOAD_BLOCKED = 'file_upload_blocked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
}

// Security event interface
export interface SecurityEvent extends LogEntry {
  eventType: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
}

// Logger class
export class SecurityLogger {
  private static instance: SecurityLogger;
  
  private constructor() {}
  
  public static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }
  
  // Log security events
  public logSecurityEvent(
    eventType: SecurityEventType,
    message: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    riskScore: number,
    context?: Record<string, any>,
    request?: NextRequest
  ): void {
    const logEntry: SecurityEvent = {
      timestamp: new Date().toISOString(),
      level: this.getLogLevel(severity),
      eventType,
      message,
      severity,
      riskScore,
      context,
      ...this.extractRequestInfo(request),
    };
    
    this.writeLog(logEntry);
  }
  
  // Log general application events
  public log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    request?: NextRequest
  ): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      ...this.extractRequestInfo(request),
    };
    
    this.writeLog(logEntry);
  }
  
  // Extract request information
  private extractRequestInfo(request?: NextRequest): Partial<LogEntry> {
    if (!request) return {};
    
    return {
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      url: request.url,
      method: request.method,
    };
  }
  
  // Convert severity to log level
  private getLogLevel(severity: string): LogLevel {
    switch (severity) {
      case 'critical':
      case 'high':
        return LogLevel.ERROR;
      case 'medium':
        return LogLevel.WARN;
      case 'low':
        return LogLevel.INFO;
      default:
        return LogLevel.INFO;
    }
  }
  
  // Write log entry (in production, send to external logging service)
  private writeLog(logEntry: LogEntry | SecurityEvent): void {
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(JSON.stringify(logEntry, null, 2));
      return;
    }
    
    // In production, you would:
    // 1. Send to external logging service (e.g., DataDog, Splunk, ELK)
    // 2. Store in database
    // 3. Send alerts for critical events
    
    // For now, we'll use structured logging
    const logMessage = JSON.stringify(logEntry);
    
    // Write to file (in production, use proper log rotation)
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'production') {
      // This would be implemented with proper file logging
      console.log(logMessage);
    } else {
      console.log(logMessage);
    }
    
    // Send alerts for critical security events
    if ('severity' in logEntry && logEntry.severity === 'critical') {
      this.sendSecurityAlert(logEntry as SecurityEvent);
    }
  }
  
  // Send security alerts (implement based on your notification system)
  private sendSecurityAlert(event: SecurityEvent): void {
    // In production, implement:
    // 1. Email alerts to security team
    // 2. Slack/Discord notifications
    // 3. SMS alerts for critical events
    // 4. Integration with SIEM systems
    
    console.error('🚨 CRITICAL SECURITY ALERT:', {
      eventType: event.eventType,
      message: event.message,
      riskScore: event.riskScore,
      timestamp: event.timestamp,
    });
  }
}

// Convenience functions
export const securityLogger = SecurityLogger.getInstance();

// Log authentication failures
export function logAuthFailure(
  reason: string,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.AUTHENTICATION_FAILED,
    `Authentication failed: ${reason}`,
    'medium',
    60,
    context,
    request
  );
}

// Log authorization denials
export function logAuthzDenial(
  resource: string,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.AUTHORIZATION_DENIED,
    `Access denied to resource: ${resource}`,
    'medium',
    50,
    context,
    request
  );
}

// Log rate limit violations
export function logRateLimitViolation(
  endpoint: string,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.RATE_LIMIT_EXCEEDED,
    `Rate limit exceeded for endpoint: ${endpoint}`,
    'high',
    70,
    context,
    request
  );
}

// Log invalid input attempts
export function logInvalidInput(
  inputType: string,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.INVALID_INPUT,
    `Invalid input detected: ${inputType}`,
    'low',
    30,
    context,
    request
  );
}

// Log payment security issues
export function logPaymentSecurityIssue(
  issue: string,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.PAYMENT_SIGNATURE_INVALID,
    `Payment security issue: ${issue}`,
    'critical',
    90,
    context,
    request
  );
}

// Log CSRF violations
export function logCSRFViolation(
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.CSRF_TOKEN_INVALID,
    'CSRF token validation failed',
    'high',
    80,
    context,
    request
  );
}

// Log file upload security issues
export function logFileUploadBlocked(
  reason: string,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  securityLogger.logSecurityEvent(
    SecurityEventType.FILE_UPLOAD_BLOCKED,
    `File upload blocked: ${reason}`,
    'medium',
    60,
    context,
    request
  );
}

// Log suspicious activity
export function logSuspiciousActivity(
  activity: string,
  riskScore: number,
  context?: Record<string, any>,
  request?: NextRequest
): void {
  const severity = riskScore >= 80 ? 'critical' : 
                   riskScore >= 60 ? 'high' : 
                   riskScore >= 40 ? 'medium' : 'low';
  
  securityLogger.logSecurityEvent(
    SecurityEventType.SUSPICIOUS_ACTIVITY,
    `Suspicious activity detected: ${activity}`,
    severity,
    riskScore,
    context,
    request
  );
}
