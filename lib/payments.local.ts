import AsyncStorage from '@react-native-async-storage/async-storage';

export type PaymentMethod =
  | { id: string; type: 'card'; last4: string; brand?: string; name?: string }
  | { id: string; type: 'upi'; provider: 'gpay' | 'phonepe' | 'upi'; upiId?: string }
  | { id: string; type: 'wallet'; wallet: 'amazonpay' };

const KEY = 'payment_methods';

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

async function save(list: PaymentMethod[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

export async function addCard(params: { number: string; name?: string }): Promise<PaymentMethod> {
  const last4 = params.number.slice(-4);
  const pm: PaymentMethod = { id: `card_${Date.now()}`, type: 'card', last4, name: params.name, brand: 'Card' };
  const list = await getPaymentMethods();
  const updated = [pm, ...list];
  await save(updated);
  return pm;
}

export async function addUpi(params: { provider: 'gpay' | 'phonepe' | 'upi'; upiId?: string }): Promise<PaymentMethod> {
  const pm: PaymentMethod = { id: `upi_${Date.now()}`, type: 'upi', provider: params.provider, upiId: params.upiId };
  const list = await getPaymentMethods();
  const updated = [pm, ...list];
  await save(updated);
  return pm;
}

export async function addWallet(wallet: 'amazonpay'): Promise<PaymentMethod> {
  const pm: PaymentMethod = { id: `wallet_${Date.now()}`, type: 'wallet', wallet };
  const list = await getPaymentMethods();
  const updated = [pm, ...list];
  await save(updated);
  return pm;
}

export async function removeMethod(id: string) {
  const list = await getPaymentMethods();
  const updated = list.filter((m) => m.id !== id);
  await save(updated);
}
