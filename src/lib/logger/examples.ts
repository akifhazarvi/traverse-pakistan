// Example 1: Log a booking creation
// import { logAudit } from '@/lib/logger';
//
// logAudit('booking_created', {
//   requestId: req.headers.get('x-request-id') || 'unknown',
//   bookingRef: 'TP-2024-001',
//   ip: req.ip,
//   amount: 50000,
//   details: { seats: 2, departure: 'Islamabad' },
// });

// Example 2: Log an error
// import { logError } from '@/lib/logger';
//
// logError(
//   'Failed to create booking',
//   err,
//   req.headers.get('x-request-id') || 'unknown',
//   { seats: 2, departureId: '123' }
// );

// Example 3: Log a validation failure
// logAudit('validation_failed', {
//   requestId: req.headers.get('x-request-id') || 'unknown',
//   ip: req.ip,
//   details: { field: 'email', reason: 'invalid format' },
// });
