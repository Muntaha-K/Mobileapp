/** Formatting helpers for currency, dates and masked numbers. */

export const CURRENCY = 'SAR';

/** Formats a number as Saudi Riyal, e.g. 12345.6 -> "12,345.60". */
export function formatMoney(amount: number, withSign = false): string {
  const sign = amount < 0 ? '-' : withSign ? '+' : '';
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${formatted}`;
}

/** Formats an amount together with the currency label. */
export function formatCurrency(amount: number, withSign = false): string {
  return `${formatMoney(amount, withSign)} ${CURRENCY}`;
}

/** Masks all but the last 4 digits of a card/account number. */
export function maskNumber(value: string, visible = 4): string {
  const digits = value.replace(/\s+/g, '');
  const tail = digits.slice(-visible);
  return `•••• ${tail}`;
}

/** Groups a card number into 4-digit blocks. */
export function groupCardNumber(value: string): string {
  return value.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

/** Formats an ISO date string into a friendly label, e.g. "11 Sep 2026". */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/** Short day + month, e.g. "Sep 11". */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Groups transactions by a human date bucket (Today / Yesterday / date). */
export function dateBucket(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOfDay = (x: Date) =>
    new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOfDay(now) - startOfDay(d)) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return formatDate(iso);
}

/** Returns initials from a name, e.g. "Sara Al Otaibi" -> "SA". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}
