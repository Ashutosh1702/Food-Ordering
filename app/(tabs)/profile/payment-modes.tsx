import { useEffect, useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';
import CustomButton from '@/components/CustomButton';
import { addCard, addUpi, addWallet, getPaymentMethods, removeMethod, PaymentMethod } from '@/lib/payments.local';
import cn from 'clsx';

const PaymentModes = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'card'|'upi'|'wallet'>('card');

  const [card, setCard] = useState({ number: '', name: '' });
  const [upi, setUpi] = useState({ provider: 'gpay' as 'gpay' | 'phonepe' | 'upi', id: '' });
  const [wallet, setWallet] = useState<'amazonpay'>('amazonpay');

  const load = async () => {
    setLoading(true);
    const list = await getPaymentMethods();
    setMethods(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const onAddCard = async () => {
    if (!card.number) return Alert.alert('Error', 'Enter card number');
    const pm = await addCard({ number: card.number, name: card.name });
    setCard({ number: '', name: '' });
    setMethods((m) => [pm, ...m]);
  };

  const onAddUpi = async () => {
    const pm = await addUpi({ provider: upi.provider, upiId: upi.id || undefined });
    setUpi({ provider: 'gpay', id: '' });
    setMethods((m) => [pm, ...m]);
  };

  const onAddWallet = async () => {
    const pm = await addWallet(wallet);
    setMethods((m) => [pm, ...m]);
  };

  const onRemove = async (id: string) => {
    await removeMethod(id);
    setMethods((m) => m.filter((x) => x.id !== id));
  };

  const renderItem = ({ item }: { item: PaymentMethod }) => {
    if (item.type === 'card') {
      return (
        <View className="border border-gray-200 rounded-xl p-4 flex-row items-center justify-between">
          <Text className="paragraph-medium text-dark-100">Card •••• {item.last4} {item.name ? `(${item.name})` : ''}</Text>
          <TouchableOpacity onPress={() => onRemove(item.id)}>
            <Text className="paragraph-medium text-primary">Remove</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (item.type === 'upi') {
      const label = item.upiId ? item.upiId : (item.provider === 'gpay' ? 'Google Pay' : item.provider === 'phonepe' ? 'PhonePe' : 'UPI');
      return (
        <View className="border border-gray-200 rounded-xl p-4 flex-row items-center justify-between">
          <Text className="paragraph-medium text-dark-100">UPI • {label}</Text>
          <TouchableOpacity onPress={() => onRemove(item.id)}>
            <Text className="paragraph-medium text-primary">Remove</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View className="border border-gray-200 rounded-xl p-4 flex-row items-center justify-between">
        <Text className="paragraph-medium text-dark-100">Wallet • Amazon Pay</Text>
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Text className="paragraph-medium text-primary">Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={methods}
        refreshing={loading}
        onRefresh={load}
        keyExtractor={(i) => i.id}
        contentContainerClassName="px-5 pb-28 gap-4"
        ListHeaderComponent={() => (
          <View className="gap-4 pt-5">
            <CustomHeader title="Payment Modes" />
            <View className="flex-row gap-2">
              <TouchableOpacity onPress={() => setTab('card')} className={cn('px-4 py-2 rounded-full border', tab==='card' ? 'bg-amber-500' : 'border-gray-200')}>
                <Text className={cn('base-bold', tab==='card' ? 'text-white' : 'text-dark-100')}>Card</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('upi')} className={cn('px-4 py-2 rounded-full border', tab==='upi' ? 'bg-amber-500' : 'border-gray-200')}>
                <Text className={cn('base-bold', tab==='upi' ? 'text-white' : 'text-dark-100')}>UPI</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('wallet')} className={cn('px-4 py-2 rounded-full border', tab==='wallet' ? 'bg-amber-500' : 'border-gray-200')}>
                <Text className={cn('base-bold', tab==='wallet' ? 'text-white' : 'text-dark-100')}>Wallet</Text>
              </TouchableOpacity>
            </View>

            {tab === 'card' && (
              <View className="gap-3">
                <Text className="base-bold text-dark-100">Add card</Text>
                <TextInput
                  placeholder="Card Number"
                  keyboardType="number-pad"
                  value={card.number}
                  onChangeText={(t) => setCard((p) => ({...p, number: t}))}
                  className="border border-gray-200 rounded-xl p-3"
                />
                <TextInput
                  placeholder="Name on Card (optional)"
                  value={card.name}
                  onChangeText={(t) => setCard((p) => ({...p, name: t}))}
                  className="border border-gray-200 rounded-xl p-3"
                />
                <CustomButton title="Save Card" onPress={onAddCard} />
              </View>
            )}

            {tab === 'upi' && (
              <View className="gap-3">
                <Text className="base-bold text-dark-100">Add UPI</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => setUpi((p) => ({...p, provider: 'gpay'}))} className={cn('flex-1 border rounded-xl p-3', upi.provider==='gpay' ? 'border-amber-500' : 'border-gray-200')}>
                    <Text className="paragraph-bold text-dark-100">Google Pay</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setUpi((p) => ({...p, provider: 'phonepe'}))} className={cn('flex-1 border rounded-xl p-3', upi.provider==='phonepe' ? 'border-amber-500' : 'border-gray-200')}>
                    <Text className="paragraph-bold text-dark-100">PhonePe</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setUpi((p) => ({...p, provider: 'upi'}))} className={cn('flex-1 border rounded-xl p-3', upi.provider==='upi' ? 'border-amber-500' : 'border-gray-200')}>
                    <Text className="paragraph-bold text-dark-100">UPI ID</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholder="UPI ID (optional)"
                  value={upi.id}
                  onChangeText={(t) => setUpi((p) => ({...p, id: t}))}
                  className="border border-gray-200 rounded-xl p-3"
                />
                <CustomButton title="Save UPI" onPress={onAddUpi} />
              </View>
            )}

            {tab === 'wallet' && (
              <View className="gap-3">
                <Text className="base-bold text-dark-100">Add Wallet</Text>
                <TouchableOpacity onPress={() => setWallet('amazonpay')} className={cn('border rounded-xl p-3', wallet==='amazonpay' ? 'border-amber-500' : 'border-gray-200')}>
                  <Text className="paragraph-bold text-dark-100">Amazon Pay</Text>
                </TouchableOpacity>
                <CustomButton title="Save Wallet" onPress={onAddWallet} />
              </View>
            )}

            <Text className="h3-bold text-dark-100 mt-2">Saved methods</Text>
          </View>
        )}
        renderItem={renderItem}
        ListEmptyComponent={() => !loading && <Text>No payment methods saved</Text>}
      />
    </SafeAreaView>
  );
};

export default PaymentModes;
