export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

export type FormResult<T> =
  | { success: true; data: T }
  | {
      success: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
      formData: FormData;
    };
