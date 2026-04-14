// Simulates a mobile money request with realistic async behaviour.
// Drop-in ready for a real provider SDK: replace simulateMomoRequest
// with an actual API call and keep the same { status } return shape.

const PROVIDER_LABELS = {
  mtn:    'MTN MoMo',
  airtel: 'Airtel Money',
};

export function getProviderLabel(provider) {
  return PROVIDER_LABELS[provider] || provider;
}

export const PROVIDERS = [
  { id: 'mtn',    label: 'MTN MoMo',     color: '#B8860B', border: '#FFCC00', bg: '#FFF9E6', activeBg: '#FEF9C3' },
  { id: 'airtel', label: 'Airtel Money',  color: '#991b1b', border: '#EF4444', bg: '#FFF1F2', activeBg: '#FEE2E2' },
];

export function getProvider(id) {
  return PROVIDERS.find(p => p.id === id) || null;
}

/**
 * Simulates sending a mobile money request to the user's phone.
 * Resolves after 2–4 seconds with { status: 'success' | 'failed' }.
 * Success rate: 70%.
 */
export async function simulateMomoRequest() {
  const delay = 2000 + Math.random() * 2000;
  await new Promise(r => setTimeout(r, delay));
  return { status: Math.random() < 0.7 ? 'success' : 'failed' };
}
