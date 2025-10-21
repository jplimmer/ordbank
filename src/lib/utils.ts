import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';
import { getLogger } from './logger';
import { ValidationError } from './types/common';

const logger = getLogger();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extracts form values for use in input default values
export const getFormValue = (
  formData: FormData,
  key: string,
  defaultValue = ''
) => {
  const value = formData.get(key);
  return typeof value === 'string' ? value : defaultValue;
};

// Formats, logs and returns validation errors
export const handleValidationError = <T extends object>(
  error: z.ZodError<T>,
  context: string
): ValidationError<T> => {
  const formErrors = z.flattenError(error).formErrors;
  const fieldErrors = z.flattenError(error).fieldErrors;

  const fieldErrorKeys = Object.keys(fieldErrors).join(', ');
  const errorMsg = `${context} validation failed, please correct errors in the following fields: ${fieldErrorKeys}`;

  logger.error(errorMsg);
  return {
    message: errorMsg,
    formErrors: formErrors,
    fieldErrors: fieldErrors,
  };
};

// Returns a copy of an array with the items randomly shuffled
export const shuffle = <T>(array: T[]): T[] => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    // Pick a random index for j
    const j = Math.floor(Math.random() * (i + 1));
    // Swap i with j
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

// Formats number of seconds to hh:mm:ss string
export const formatTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const minsString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minsString}`;
  }

  return minsString;
};

// Returns a 'pair name' with the first three letters of each string separated by a hyphen
export const generatePairName = (
  sourceName: string,
  targetName: string
): string => {
  return `${sourceName.slice(0, 3).toUpperCase()}-${targetName.slice(0, 3).toUpperCase()}`;
};
