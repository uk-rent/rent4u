
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to conditionally join class names together
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency with the given currency code
 * @param amount - Amount to format
 * @param currency - Currency code (e.g., USD, EUR)
 * @param locale - Locale for formatting (defaults to browser locale)
 */
export const formatCurrency = (
  amount: number, 
  currency: string = 'USD', 
  locale?: string
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date using the specified format
 * @param date - Date to format
 * @param format - Format string (defaults to 'PPP')
 * @param locale - Locale for formatting (defaults to browser locale)
 */
export const formatDate = (
  date: Date | string,
  format: string = 'PPP',
  locale?: string
): string => {
  if (!date) return '';
  
  // Convert string to Date if necessary
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Simple formatter using toLocaleDateString
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
