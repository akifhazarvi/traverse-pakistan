export interface AuditAction {
  booking_created: string;
  booking_cancelled: string;
  booking_confirmed: string;
  payment_initiated: string;
  payment_confirmed: string;
  payment_failed: string;
  user_data_modified: string;
  validation_failed: string;
  rate_limit_exceeded: string;
  cors_blocked: string;
  [key: string]: string;
}

export interface AuditLog {
  requestId: string;
  timestamp: string; // ISO 8601
  actionType: keyof AuditAction;
  userId?: string;
  bookingRef?: string;
  ip?: string;
  amount?: number;
  details?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}
