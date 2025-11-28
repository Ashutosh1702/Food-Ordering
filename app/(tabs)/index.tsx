import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Fragment } from "react";
import cn from "clsx";

import CartButton from "@/components/CartButton";
import { images, offers } from "@/constants";
import useAuthStore from "@/store/auth.store";
import { router } from "expo-router";
import useAppwrite from "@/lib/useAppwrite";
import { getMenu } from "@/lib/appwrite";
import { MenuItem } from "@/type";
import { appwriteConfig } from "@/lib/appwrite";

export default function Index() {
  const { user } = useAuthStore();
  const { data: topPicks } = useAppwrite<MenuItem[], { category: string; query: string; limit: number}>({
    fn: getMenu as any,
    params: { category: 'all' as any, query: '', limit: 8 },
  });

  const onOfferPress = (title: string) => {
    const t = title.toUpperCase();
    if (t.includes("BURGER")) {
      router.push({ pathname: "/search", params: { category: "Burgers" } });
      return;
    }
    if (t.includes("PIZZA")) {
      router.push({ pathname: "/search", params: { category: "Pizzas" } });
      return;
    }
    if (t.includes("BURRITO")) {
      router.push({ pathname: "/search", params: { category: "Burritos" } });
      return;
    }
    router.push({ pathname: "/search", params: { category: "all", query: "combo" } });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={offers}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;

          return (
            <View>
              <Pressable
                className={cn(
                  "offer-card",
                  isEven ? "flex-row-reverse" : "flex-row"
                )}
                style={{ backgroundColor: item.color }}
                android_ripple={{ color: "#fffff22" }}
                onPress={() => onOfferPress(item.title)}
              >
                {({ pressed }) => (
                  <Fragment>
                    <View className={"h-full w-1/2"}>
                      <Image
                        source={item.image}
                        className={"size-full"}
                        resizeMode={"contain"}
                      />
                    </View>

                    <View
                      className={cn(
                        "offer-card__info",
                        isEven ? "pl-10" : "pr-10"
                      )}
                    >
                      <Text className="h1-bold text-white leading-tight">
                        {item.title}
                      </Text>
                      <Image
                        source={images.arrowRight}
                        className="size-10"
                        resizeMode="contain"
                        tintColor="#ffffff"
                      />
                    </View>
                  </Fragment>
                )}
              </Pressable>
            </View>
          );
        }}
        contentContainerClassName="pb-28 px-5"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-between flex-row w-full">
              <View className="flex-start">
                <Text className="small-bold text-primary">DELIVER TO</Text>
                <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
                  <Text className="paragraph-bold text-dark-100">Croatia</Text>
                  <Image
                    source={images.arrowDown}
                    className="size-3"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <CartButton />
            </View>

            {/* Tappable search bar leading to Search screen */}
            <TouchableOpacity
              className="searchbar"
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: "/search", params: { category: "all" } })}
            >
              <Text className="text-gray-300">Search for pizzas, burgers...</Text>
              <Image source={images.search} className="size-5" resizeMode="contain" />
            </TouchableOpacity>

            {/* Categories chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {[
                { label: "All", category: "all" },
                { label: "Burgers", category: "Burgers" },
                { label: "Pizzas", category: "Pizzas" },
                { label: "Burritos", category: "Burritos" },
                { label: "Wraps", category: "Wraps" },
                { label: "Bowls", category: "Bowls" },
              ].map((c) => (
                <TouchableOpacity
                  key={c.label}
                  className="filter bg-white"
                  onPress={() => router.push({ pathname: "/search", params: { category: c.category } })}
                >
                  <Text className="body-medium text-gray-200">{c.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Top Picks horizontal scroller */}
            {Array.isArray(topPicks) && topPicks.length > 0 && (
              <View className="gap-3">
                <View className="flex-between flex-row">
                  <Text className="h3-bold text-dark-100">Top Picks</Text>
                  <TouchableOpacity onPress={() => router.push({ pathname: "/search", params: { category: 'all' } })}>
                    <Text className="paragraph-bold text-primary">See all</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                  {topPicks.slice(0, 10).map((it: any, idx: number) => {
                    const isExternal = /^https?:\/\//i.test(it.image_url);
                    const img = isExternal ? it.image_url : `${it.image_url}?project=${appwriteConfig.projectId}`;
                    const localOverrides: Record<string, any> = {
                      "Summer Combo Deluxe": images.burgerOne,
                      "Classic Burger Combo": images.burgerTwo,
                      "Mega Combo Feast": images.pizzaOne,
                      "BBQ Chicken Pizza": images.pizzaOne,
                      "Veggie Supreme Pizza": images.pizzaOne,
                      "Four Cheese Pizza": images.pizzaOne,
                      "Spicy Beef Burrito": images.buritto,
                      "Loaded Veg Burrito": images.buritto,
                    };
                    const localSource = localOverrides[it.name];
                    return (
                      <TouchableOpacity
                        key={`${it.$id}-${idx}`}
                        className="w-36"
                        onPress={() => router.push({ pathname: "/search", params: { query: it.name } })}
                        activeOpacity={0.9}
                      >
                        <View className="border border-gray-200 rounded-xl p-3 items-center bg-white" style={{ shadowColor: '#878787' }}>
                          <Image source={localSource ?? { uri: img }} className="w-28 h-24" resizeMode="contain" />
                          <Text className="mt-2 base-semibold text-dark-100" numberOfLines={1}>{it.name}</Text>
                          <Text className="paragraph-medium text-gray-200">From ${Number(it.price).toFixed(2)}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Section heading */}
            <Text className="h3-bold text-dark-100">Today's Offers</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
