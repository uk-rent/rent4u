
/**
 * Format a date string into a localized date format
 */
export function formatDate(dateString: string | undefined, options: Intl.DateTimeFormatOptions = {}): string {
  if (!dateString) return 'N/A';
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', defaultOptions).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

/**
 * Format a number as a currency
 */
export function formatCurrency(
  value: number | undefined, 
  currency = 'GBP', 
  locale = 'en-GB'
): string {
  if (value === undefined) return 'N/A';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${value}`;
  }
}
