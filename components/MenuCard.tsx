import {Text, TouchableOpacity, Image, Platform} from 'react-native'
import {MenuItem} from "@/type";
import {appwriteConfig} from "@/lib/appwrite";
import {useCartStore} from "@/store/cart.store";
import { images } from "@/constants";

const MenuCard = ({ item: { $id, image_url, name, price }}: { item: MenuItem}) => {
    const isExternal = /^https?:\/\//i.test(image_url);
    const imageUrl = isExternal ? image_url : `${image_url}?project=${appwriteConfig.projectId}`;

    // Local image overrides for specific popular items to ensure high-quality visuals
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
    const localSource = localOverrides[name];
    const { addItem } = useCartStore();

    return (
        <TouchableOpacity className="menu-card" style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787'}: {}}>
            <Image source={localSource ?? { uri: imageUrl }} className="size-32 absolute -top-10" resizeMode="contain" />
            <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>{name}</Text>
            <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
            <TouchableOpacity onPress={() => addItem({ id: $id, name, price, image_url: imageUrl, customizations: []})}>
                <Text className="paragraph-bold text-primary">Add to Cart +</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    )
}
export default MenuCard
