import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import CartStyle from "./cart.style";
import { useCallback, useState } from "react";
import { CartItemType } from "@/src/data/types/global";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import CartItemComponent from "./comp/cart-item.comp";
import * as CartManagement from "../../data/management/cart.management";
import { CartModel } from "@/src/data/model/cart.model";
import { AppConfig } from "@/src/common/config/app.config";
import { AntDesign, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";

type Props = {}

const CartScreen = (props: Props) => {
    const [preImage, setPreImage] = useState('');
    const [cart, setCart] = useState<CartModel>();
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchPreImage();
            fetchCartByUser();
        }, [])
    )

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchCartByUser = async () => {
        setLoading(true);
        try {
            const response = await CartManagement.fetchCartByUser();
            console.log(response);
            setCart(response);
        } catch (error) {
            console.log(error);
        }

        setRefreshing(false);
        setLoading(false);
    }

    const handleRefreshCart = useCallback(() => {
        setRefreshing(true);
        fetchCartByUser();
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
                {cart && cart.cart_shops.length > 0 && (
                    <FlatList
                        data={cart?.cart_shops}
                        keyExtractor={(item) => item.id.toString()}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 20 }}></View>
                        )}
                        renderItem={({ index, item }) => (
                            <Animated.View style={styles.cartShopWrapper} entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                                <View style={styles.cartShopHeader}>
                                    <View style={styles.checkbox}></View>
                                    <Text style={styles.shopNameText}>{item.shop?.shop_name}</Text>
                                </View>
                                <View style={styles.listCartItemWrapper}>
                                    {item.cart_items.length > 0 &&
                                        item.cart_items.map((cart_item, index) => (
                                            <View key={`item-${cart_item.id}-${index}`} style={styles.cartItemWrapper}>
                                                <View style={styles.checkbox}></View>
                                                <View style={styles.cartItemInfo}>
                                                    <Image style={styles.cartItemImage} source={{ uri: `${preImage}/${cart_item.product_variant?.image_url}` }} />
                                                    <View style={styles.cartItemContent}>
                                                        <Text style={styles.cartItemNameText}>{cart_item.product_variant?.product?.product_name}</Text>
                                                        <View style={styles.cartItemPriceAndQuantity}>
                                                            <View style={styles.priceWrapper}>
                                                                <Text style={styles.dText}>đ</Text>
                                                                <Text style={styles.priceText}>
                                                                    {cart_item.product_variant?.product?.unit_price ?? 0}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <TouchableOpacity>
                                                            <Ionicons name="trash-outline" size={20} color={CommonColors.red} />
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            </View>
                                        ))
                                    }
                                </View>
                                <View style={styles.devider}></View>
                                <View style={styles.promotionWrapper}>
                                    <TouchableOpacity style={styles.promotionItem}>
                                        <Ionicons name="ticket-outline" size={24} color="#FF0000" />
                                        <Text style={styles.promotionText}>Voucher</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.promotionItem}>
                                        <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={CommonColors.green} />
                                        <Text style={styles.promotionText}>Miễn phí vận chuyện cho đơn hàng 0đ</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        )}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={handleRefreshCart}
                    />
                )}
            </View>
            <Animated.View style={styles.footer} entering={FadeInDown.delay(500).duration(500).springify()}>
                <View style={styles.priceInfoWrapper}>
                    <Text style={styles.totalText}>Total: đ100</Text>
                </View>
                <TouchableOpacity style={styles.checkoutBtn}>
                    <Text style={styles.checkoutBtnText}>Thanh toán (5)</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

const styles = CartStyle;

export default CartScreen;