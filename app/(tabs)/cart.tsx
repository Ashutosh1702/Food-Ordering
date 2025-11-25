import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import cn from 'clsx';

import { useCartStore } from '@/store/cart.store';
import CustomHeader from '@/components/CustomHeader';
import CustomButton from '@/components/CustomButton';
import CartItem from '@/components/CartItem';

type PaymentMethod = 'card' | 'upi' | 'wallet';
type WalletProvider = 'amazonpay';

type CardState = {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
};

type UpiProvider = 'gpay' | 'phonepe';

type UpiState = {
  provider: UpiProvider;
  id: string;
};

const PaymentInfoStripe = ({
  label,
  value,
  labelStyle,
  valueStyle,
}: {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}) => (
  <View className="flex-between flex-row my-1">
    <Text className={cn('paragraph-medium text-gray-200', labelStyle)}>
      {label}
    </Text>
    <Text className={cn('paragraph-bold text-dark-100', valueStyle)}>
      {value}
    </Text>
  </View>
);

const Cart: React.FC = () => {
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();

  const [showPayment, setShowPayment] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [card, setCard] = useState<CardState>({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [upi, setUpi] = useState<UpiState>({ provider: 'gpay', id: '' });
  const [wallet, setWallet] = useState<WalletProvider>('amazonpay');

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const deliveryFee = 5;
  const discount = 0.5;
  const grandTotal = totalPrice + deliveryFee - discount;

  const handleCardPay = () => {
    if (!card.number || !card.name || !card.expiry || !card.cvv) return;

    setShowPayment(false);
    clearCart();
    router.replace('/success');
  };

  const handleUpiPay = () => {
    setShowPayment(false);
    clearCart();
    router.replace('/success');
  };

  const handleWalletPay = () => {
    setShowPayment(false);
    clearCart();
    router.replace('/success');
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={items}
        renderItem={({ item }) => <CartItem item={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title="Your Cart" />}
        ListEmptyComponent={() => <Text>Cart Empty</Text>}
        ListFooterComponent={() =>
          totalItems > 0 && (
            <View className="gap-5">
              <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
                <Text className="h3-bold text-dark-100 mb-5">
                  Payment Summary
                </Text>

                <PaymentInfoStripe
                  label={`Total Items (${totalItems})`}
                  value={`$${totalPrice.toFixed(2)}`}
                />
                <PaymentInfoStripe
                  label="Delivery Fee"
                  value={`$${deliveryFee.toFixed(2)}`}
                />
                <PaymentInfoStripe
                  label="Discount"
                  value={`- $${discount.toFixed(2)}`}
                  valueStyle="!text-success"
                />
                <View className="border-t border-gray-300 my-2" />
                <PaymentInfoStripe
                  label="Total"
                  value={`$${grandTotal.toFixed(2)}`}
                  labelStyle="base-bold !text-dark-100"
                  valueStyle="base-bold !text-dark-100 !text-right"
                />
              </View>

              <CustomButton
                title="Order Now"
                onPress={() => setShowPayment(true)}
              />
            </View>
          )
        }
      />

      {/* Payment Modal (Dummy) */}
      <Modal
        visible={showPayment}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPayment(false)}
      >
        <View className="flex-1 bg-black/40 items-center justify-end">
          <View className="bg-white w-full rounded-t-3xl p-6 gap-4">
            <Text className="h3-bold text-dark-100">Payment</Text>
            <Text className="paragraph-medium text-gray-200">
              Amount: ${grandTotal.toFixed(2)}
            </Text>

            {/* Method selector */}
            <View className="flex-row gap-2 mt-2">
              <TouchableOpacity
                onPress={() => setMethod('card')}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  method === 'card' ? 'bg-amber-500' : 'border-gray-200'
                )}
              >
                <Text
                  className={cn(
                    'base-bold',
                    method === 'card' ? 'text-white' : 'text-dark-100'
                  )}
                >
                  Card
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMethod('upi')}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  method === 'upi' ? 'bg-amber-500' : 'border-gray-200'
                )}
              >
                <Text
                  className={cn(
                    'base-bold',
                    method === 'upi' ? 'text-white' : 'text-dark-100'
                  )}
                >
                  UPI
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMethod('wallet')}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  method === 'wallet' ? 'bg-amber-500' : 'border-gray-200'
                )}
              >
                <Text
                  className={cn(
                    'base-bold',
                    method === 'wallet' ? 'text-white' : 'text-dark-100'
                  )}
                >
                  Wallet
                </Text>
              </TouchableOpacity>
            </View>

            {/* Card */}
            {method === 'card' && (
              <View className="gap-3 mt-2">
                <Text className="base-bold text-dark-100">
                  Credit/Debit Card
                </Text>
                <TextInput
                  placeholder="Card Number"
                  value={card.number}
                  onChangeText={(t) => setCard((p) => ({ ...p, number: t }))}
                  keyboardType="number-pad"
                  className="border border-gray-200 rounded-xl p-3"
                />
                <TextInput
                  placeholder="Name on Card"
                  value={card.name}
                  onChangeText={(t) => setCard((p) => ({ ...p, name: t }))}
                  className="border border-gray-200 rounded-xl p-3"
                />
                <View className="flex-row gap-2">
                  <TextInput
                    placeholder="MM/YY"
                    value={card.expiry}
                    onChangeText={(t) => setCard((p) => ({ ...p, expiry: t }))}
                    className="flex-1 border border-gray-200 rounded-xl p-3"
                  />
                  <TextInput
                    placeholder="CVV"
                    value={card.cvv}
                    onChangeText={(t) => setCard((p) => ({ ...p, cvv: t }))}
                    keyboardType="number-pad"
                    secureTextEntry
                    className="flex-1 border border-gray-200 rounded-xl p-3"
                  />
                </View>
                <CustomButton title="Pay Securely" onPress={handleCardPay} />
              </View>
            )}

            {/* UPI */}
            {method === 'upi' && (
              <View className="gap-3 mt-2">
                <Text className="base-bold text-dark-100">UPI</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() =>
                      setUpi((p) => ({ ...p, provider: 'gpay' }))
                    }
                    className={cn(
                      'flex-1 border rounded-xl p-3',
                      upi.provider === 'gpay'
                        ? 'border-amber-500'
                        : 'border-gray-200'
                    )}
                  >
                    <Text className="paragraph-bold text-dark-100">
                      Google Pay
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      setUpi((p) => ({ ...p, provider: 'phonepe' }))
                    }
                    className={cn(
                      'flex-1 border rounded-xl p-3',
                      upi.provider === 'phonepe'
                        ? 'border-amber-500'
                        : 'border-gray-200'
                    )}
                  >
                    <Text className="paragraph-bold text-dark-100">
                      PhonePe
                    </Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholder="Or enter UPI ID (e.g., name@okicici)"
                  value={upi.id}
                  onChangeText={(t) => setUpi((p) => ({ ...p, id: t }))}
                  className="border border-gray-200 rounded-xl p-3"
                />
                <CustomButton title="Pay via UPI" onPress={handleUpiPay} />
              </View>
            )}

            {/* Wallet */}
            {method === 'wallet' && (
              <View className="gap-3 mt-2">
                <Text className="base-bold text-dark-100">Wallets</Text>
                <TouchableOpacity
                  onPress={() => setWallet('amazonpay')}
                  className={cn(
                    'border rounded-xl p-3',
                    wallet === 'amazonpay'
                      ? 'border-amber-500'
                      : 'border-gray-200'
                  )}
                >
                  <Text className="paragraph-bold text-dark-100">
                    Amazon Pay
                  </Text>
                </TouchableOpacity>
                <CustomButton
                  title="Pay with Amazon Pay"
                  onPress={handleWalletPay}
                />
              </View>
            )}

            {/* Cancel */}
            <View className="mt-2">
              <CustomButton
                title="Cancel"
                onPress={() => setShowPayment(false)}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Cart;
