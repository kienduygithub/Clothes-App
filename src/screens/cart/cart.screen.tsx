import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import CartStyle from "./cart.style";
import { useCallback, useState } from "react";
import { CartChecked, CartItemType } from "@/src/data/types/global";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as CartManagement from "../../data/management/cart.management";
import { CartModel } from "@/src/data/model/cart.model";
import { AppConfig } from "@/src/common/config/app.config";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type Props = {}

const CartScreen = (props: Props) => {
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<CartModel>();
    const [cartChecked, setCartChecked] = useState<CartChecked>({});

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

    const handleToggleCartShop = (cartShopId: number, cartItems: { id: number }[], isChecked: boolean) => {
        // const isChecked = cartChecked?.[cartShopId]?.checked ?? false;

        const updatedItems = cartItems.reduce((sum, item) => {
            sum[item.id] = isChecked
            return sum;
        }, {} as { [cartItemId: number]: boolean })

        setCartChecked(prev => ({
            ...prev,
            [cartShopId]: {
                checked: isChecked,
                cart_items: updatedItems
            }
        }))
    }

    const handleToggleCartItem = (cartShopId: number, cartItemId: number, isChecked: boolean) => {
        const shopChecked = cartChecked[cartShopId] ?? {
            checked: false,
            cart_items: {}
        };
        // const isCartItemChecked = shopChecked.cart_items[cartItemId] ?? false;

        const updatedItems = {
            ...shopChecked.cart_items,
            [cartItemId]: isChecked
        }

        const isListCartItemChecked = Object.values(updatedItems).every(Boolean);

        setCartChecked(prev => ({
            ...prev,
            [cartShopId]: {
                checked: isListCartItemChecked,
                cart_items: updatedItems
            }
        }))
    }

    const calculatePaymentTotal = (): number => {
        let total = 0;

        cart?.cart_shops.forEach(cartShop => {
            const shopChecked = cartChecked[cartShop.id];
            if (!shopChecked) {
                return;
            }

            cartShop.cart_items.forEach(cart_item => {
                if (shopChecked.cart_items[cart_item.id]) {
                    const price = (cart_item.product_variant?.product?.unit_price ?? 0) * cart_item.quantity;
                    total += price;
                }
            })
        })

        return total;
    }

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
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={handleRefreshCart}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 20 }}></View>
                        )}
                        renderItem={({ index, item }) => (
                            <Animated.View style={styles.cartShopWrapper} entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                                <View style={styles.cartShopHeader}>
                                    <TouchableOpacity>
                                        <BouncyCheckbox
                                            size={24}
                                            fillColor={CommonColors.primary}
                                            unFillColor={CommonColors.white}
                                            isChecked={!!cartChecked[item.id]?.checked}
                                            onPress={(isChecked: boolean) => {
                                                handleToggleCartShop(item.id, item.cart_items, isChecked);
                                            }}
                                            iconStyle={{ borderColor: CommonColors.primary, borderRadius: 3 }}
                                            innerIconStyle={{ borderWidth: 1, borderRadius: 3 }}
                                        />
                                    </TouchableOpacity>
                                    <Text style={styles.shopNameText}>{item.shop?.shop_name ?? 'ABC'}</Text>
                                </View>
                                <View style={styles.listCartItemWrapper}>
                                    {item.cart_items.length > 0 &&
                                        item.cart_items.map((cart_item, index) => (
                                            <View key={`item-${cart_item.id}-${index}`} style={styles.cartItemWrapper}>
                                                <TouchableOpacity>
                                                    <BouncyCheckbox
                                                        size={24}
                                                        fillColor={CommonColors.primary}
                                                        unFillColor={CommonColors.white}
                                                        isChecked={!!cartChecked?.[item.id]?.cart_items?.[cart_item.id]}
                                                        onPress={(isChecked: boolean) => {
                                                            handleToggleCartItem(item.id, cart_item.id, isChecked);
                                                        }}
                                                        iconStyle={{ borderColor: CommonColors.primary, borderRadius: 3 }}
                                                        innerIconStyle={{ borderWidth: 1, borderRadius: 3 }}
                                                    />
                                                </TouchableOpacity>
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
                                        <Text style={styles.promotionText}>Miễn phí vận chuyển cho đơn hàng 0đ</Text>
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        )}
                    />
                )}
            </View>
            {/* Thanh toán */}
            <Animated.View style={styles.footer} entering={FadeInDown.delay(500).duration(500).springify()}>
                <View style={styles.priceInfoWrapper}>
                    <Text style={{ fontSize: 15 }}>Thành tiền: </Text>
                    <Text style={styles.dText}>đ</Text>
                    <Text style={styles.priceText}>
                        {calculatePaymentTotal().toLocaleString('vi-VN')}
                    </Text>
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