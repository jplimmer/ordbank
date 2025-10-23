export const ServiceErrorCode = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORISED: 'UNAUTHORISED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
} as const;

export const AUTH_ERROR = 'Authentication required - please sign in.';
export const PERMISSION_ERROR =
  'You do not have permission to perform this action.';
export const DATABASE_ERROR = 'Something went wrong. Please try again.';
