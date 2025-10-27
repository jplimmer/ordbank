import { ServiceErrorCode } from '../constants/errors';

// Error types
export type ServiceErrorCode =
  (typeof ServiceErrorCode)[keyof typeof ServiceErrorCode];

export type ServiceError = {
  code: ServiceErrorCode;
  message: string;
  details?: unknown;
};

// Result types
export type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

export type ServiceResult<T> = Result<T, ServiceError>;
export type ActionResult<T> = Result<T, string>;

export type FormResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      formData: FormData;
    };

export type ValidationError<T> = {
  message: string;
  formErrors: string[];
  fieldErrors: { [P in keyof T]?: string[] | undefined };
};
