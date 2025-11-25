import { Image, Text, TouchableOpacity, View, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import useAuthStore from '@/store/auth.store'
import { images } from '@/constants'
import { signOut } from '@/lib/localAuth'
import { router } from 'expo-router'

const Profile = () => {
  const { user, setIsAuthenticated, setUser } = useAuthStore()

  const onLogout = async () => {
    await signOut()
    setUser(null)
    setIsAuthenticated(false)
    router.replace('/sign-in')
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-5 py-6 gap-6">
        {/* Header card */}
        <View className="rounded-2xl px-5 py-6" style={{ backgroundColor: '#EB5A46' }}>
          <View className="flex-row items-center gap-4">
            <Image source={user?.avatar ? { uri: user.avatar } : images.avatar} className="w-16 h-16 rounded-full border-2 border-white" />
            <View className="flex-1">
              <Text className="h3-bold text-white">{user?.name ?? 'Guest User'}</Text>
              <Text className="paragraph-medium text-white/90">{user?.email ?? '—'}</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Help', 'Support coming soon')}> 
              <Text className="paragraph-bold text-white">Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Membership banner */}
        <View className="border border-gray-200 rounded-2xl p-10">
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-1 rounded bg-green-500"><Text className="caption-medium text-white">ACTIVE</Text></View>
            <Text className="base-bold text-dark-100 !text-center">Unlimited free deliveries, extra discounts & more!</Text>
          </View>
          <Text className="paragraph-medium text-gray-200 mt-1">Explore all One benefits</Text>
        </View>

        {/* Quick actions */}
        <View className="flex-row justify-between">
          {[
            { title: 'Saved Address', onPress: () => router.push('/profile/addresses') },
            { title: 'Payment Modes', onPress: () => router.push('/profile/payment-modes') },
            { title: 'My Refunds', onPress: () => Alert.alert('My Refunds', 'Coming soon') },
            { title: 'Swiggy Money', onPress: () => Alert.alert('Swiggy Money', 'Coming soon') },
          ].map((item) => (
            <TouchableOpacity key={item.title} className="items-center gap-2" onPress={item.onPress}>
              <View className="size-12 rounded-full bg-gray-100 items-center justify-center" />
              <Text className="paragraph-medium text-dark-100 text-center" numberOfLines={1}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Options list */}
        <View className="border border-gray-200 rounded-2xl overflow-hidden">
          {[
            { title: 'My Vouchers' },
            { title: 'Account Statements' },
            { title: 'Order Food on Train' },
            { title: 'Corporate Rewards' },
            { title: 'Student Rewards' },
            { title: 'My Instamart Wishlist' },
            { title: 'Favourites' },
            { title: 'Partner Rewards' },
          ].map((row, idx) => (
            <TouchableOpacity
              key={row.title}
              className={`px-5 py-4 bg-white ${idx < 7 ? 'border-b border-gray-200' : ''}`}
              onPress={() => Alert.alert(row.title, 'Coming soon')}
            >
              <View className="flex-row items-center justify-between">
                <Text className="base-bold text-dark-100">{row.title}</Text>
                <Text className="paragraph-medium text-gray-300">›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past orders */}
        <View className="gap-3">
          <Text className="base-bold text-dark-100">PAST ORDERS</Text>
          <TouchableOpacity className="self-start rounded-full px-4 py-2 bg-dark-100" onPress={() => router.push('/profile/orders')}>
            <Text className="paragraph-bold text-white">BROWSE PAST ORDERS</Text>
          </TouchableOpacity>
          <View className="flex-row bg-gray-100 rounded-full p-1 self-start">
            <TouchableOpacity className="px-4 py-2 rounded-full bg-white"><Text className="paragraph-medium text-dark-100">Food</Text></TouchableOpacity>
            <TouchableOpacity className="px-4 py-2 rounded-full"><Text className="paragraph-medium text-gray-200">Instamart</Text></TouchableOpacity>
          </View>
        </View>

        {/* Danger/Logout */}
        <View className="mt-2 border border-gray-200 rounded-2xl overflow-hidden">
          <TouchableOpacity
            className="px-5 py-4 bg-white"
            onPress={onLogout}
          >
            <Text className="base-bold text-primary">Logout</Text>
            <Text className="paragraph-medium text-gray-200">Sign out from this device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
