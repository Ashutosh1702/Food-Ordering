import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, Text, View } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { images } from '@/constants';
import { router } from 'expo-router';

const Success = () => {
  return (
    <SafeAreaView className="bg-white h-full items-center justify-center px-6">
      <Image source={images.success} className="w-56 h-56 mb-6" resizeMode="contain" />
      <Text className="h2-bold text-dark-100 text-center mb-2">Order placed!</Text>
      <Text className="paragraph-medium text-gray-200 text-center mb-8">
        Your delicious food is on its way. You can track it in your profile/orders later.
      </Text>
      <CustomButton title="Go to Home" onPress={() => router.replace('/')} />
    </SafeAreaView>
  );
};

export default Success;
