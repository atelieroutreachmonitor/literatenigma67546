export const WHATSAPP_CHANNEL = 'https://whatsapp.com/channel/0029Vb6Sksk4dTnRy63eLl2W';

export const CURRENCIES: Record<string, { symbol: string; code: string }> = {
  NGN: { symbol: '₦', code: 'NGN' },
  USD: { symbol: '$', code: 'USD' },
  GHS: { symbol: '₵', code: 'GHS' },
  GBP: { symbol: '£', code: 'GBP' },
  EUR: { symbol: '€', code: 'EUR' },
};

export const DEFAULT_CURRENCY = 'NGN';

export function formatMoney(amount: string | number, currency: string = DEFAULT_CURRENCY): string {
  const c = CURRENCIES[currency] || CURRENCIES[DEFAULT_CURRENCY];
  const num = typeof amount === 'string' ? amount : String(amount);
  return `${c.symbol}${num}`;
}
