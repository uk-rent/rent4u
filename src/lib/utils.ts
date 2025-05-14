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
