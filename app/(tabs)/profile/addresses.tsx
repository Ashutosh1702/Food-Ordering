import { useState } from 'react';
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '@/components/CustomHeader';

const Addresses = () => {
  const [list, setList] = useState<{ id: string; label: string; details: string }[]>([]);
  const [label, setLabel] = useState('');
  const [details, setDetails] = useState('');

  const add = () => {
    if (!label || !details) return Alert.alert('Error', 'Please fill both fields');
    setList((l) => [{ id: String(Date.now()), label, details }, ...l]);
    setLabel('');
    setDetails('');
  };

  const remove = (id: string) => setList((l) => l.filter((a) => a.id !== id));

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={list}
        keyExtractor={(i) => i.id}
        contentContainerClassName="px-5 pb-28 gap-4"
        ListHeaderComponent={() => (
          <View className="gap-4 pt-5">
            <CustomHeader title="Saved Address" />
            <View className="gap-2">
              <TextInput
                placeholder="Label (e.g., Home, Work)"
                value={label}
                onChangeText={setLabel}
                className="border border-gray-200 rounded-xl p-3"
              />
              <TextInput
                placeholder="Full Address"
                value={details}
                onChangeText={setDetails}
                className="border border-gray-200 rounded-xl p-3"
                multiline
              />
              <TouchableOpacity className="bg-amber-500 rounded-xl p-3 items-center" onPress={add}>
                <Text className="base-bold text-white">Add Address</Text>
              </TouchableOpacity>
            </View>
            <Text className="h3-bold text-dark-100">Saved</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View className="border border-gray-200 rounded-xl p-4 gap-1">
            <Text className="base-bold text-dark-100">{item.label}</Text>
            <Text className="paragraph-medium text-gray-200">{item.details}</Text>
            <TouchableOpacity className="self-start mt-2" onPress={() => remove(item.id)}>
              <Text className="paragraph-medium text-primary">Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => <Text className="px-5">No addresses saved</Text>}
      />
    </SafeAreaView>
  );
};

export default Addresses;
