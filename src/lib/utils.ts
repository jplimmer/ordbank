import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
