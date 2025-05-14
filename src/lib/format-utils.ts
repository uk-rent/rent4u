
/**
 * Format a date using the locale date format
 */
export function formatDate(date: string | Date, options: Intl.DateTimeFormatOptions = {}): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  }).format(dateObj);
}

/**
 * Format currency with proper symbol and decimals
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}
