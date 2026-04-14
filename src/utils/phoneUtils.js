// Uganda mobile number prefix detection
// MTN:   077x, 078x, 076x, 031x
// Airtel: 075x, 070x, 074x

export function detectProvider(phone) {
  const digits = phone.replace(/\D/g, '');
  if (/^(077|078|076|031)/.test(digits)) return 'mtn';
  if (/^(075|070|074)/.test(digits)) return 'airtel';
  return null;
}

export function sanitizePhone(phone) {
  return phone.replace(/\D/g, '').slice(0, 10);
}

export function formatPhoneDisplay(phone) {
  const d = phone.replace(/\D/g, '').slice(0, 10);
  if (d.length <= 4) return d;
  if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
  return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

export function isValidPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 && digits.startsWith('0');
}
