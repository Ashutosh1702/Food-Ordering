import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';

const Orders = () => {
  // Placeholder list; can be wired to a local orders store later
  const orders: Array<{ id: string; title: string; amount: number; date: string }> = [
    { id: 'ord-1001', title: 'Saree - Silk Handloom (Blue)', amount: 79.99, date: '2025-11-01' },
    { id: 'ord-1002', title: 'Paneer Butter Masala • SpiceHub', amount: 8.49, date: '2025-11-03' },
    { id: 'ord-1003', title: 'Groceries • Instamart', amount: 24.90, date: '2025-11-10' },
  ];

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={orders}
        keyExtractor={(i) => i.id}
        contentContainerClassName="px-5 pb-28 gap-4"
        ListHeaderComponent={() => (
          <View className="gap-4 pt-5">
            <CustomHeader title="Past Orders" />
          </View>
        )}
        renderItem={({ item }) => (
          <View className="border border-gray-200 rounded-xl p-4 gap-1">
            <Text className="base-bold text-dark-100">{item.title}</Text>
            <Text className="paragraph-medium text-gray-200">${item.amount.toFixed(2)} • {item.date}</Text>
          </View>
        )}
        ListEmptyComponent={() => <Text>No past orders</Text>}
      />
    </SafeAreaView>
  );
};

export default Orders;
