import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native"
import CartStyle from "./cart.style";
import { useCallback, useState } from "react";
import { CartItemType } from "@/src/data/types/global";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import axios from "axios";
import { Stack } from "expo-router";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown, ZoomInEasyDown } from "react-native-reanimated";
import CartItemComponent from "./comp/cart-item.comp";

type Props = {}

const CartScreen = (props: Props) => {
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            getCart();
        }, [])
    )

    const getCart = async () => {
        setLoading(true);
        try {
            const url = `http://192.168.0.103:8000/cart`;
            const response = await axios.get(url);
            setCart(response.data);
        } catch (error) {
            console.log(error);
        }

        setRefreshing(false);
        setLoading(false);
    }

    const handleRefreshCart = useCallback(() => {
        setRefreshing(true);
        getCart();
    }, [])

    const headerHeight = useHeaderHeight();
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Giỏ hàng',
                    headerTitleAlign: "center",
                    headerTransparent: true,
                }}
            />
            <View style={[styles.container, { marginTop: headerHeight }]}>
                <FlatList
                    data={cart}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ index, item }) => (
                        <Animated.View entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                            <CartItemComponent item={item} />
                        </Animated.View>
                    )}
                    showsVerticalScrollIndicator={false}
                    refreshing={refreshing}
                    onRefresh={handleRefreshCart}
                />
            </View>
            <Animated.View style={styles.footer} entering={FadeInDown.delay(500).duration(500).springify()}>
                <View style={styles.priceInfoWrapper}>
                    <Text style={styles.totalText}>Total: $100</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn}>
                    <Text style={styles.checkoutBtnText}>Thanh toán</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

const styles = CartStyle;

export default CartScreen;