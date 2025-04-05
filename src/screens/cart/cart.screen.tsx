import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import CartStyle from "./cart.style";
import { useCallback, useState } from "react";
import { CartChecked } from "@/src/data/types/global";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as CartManagement from "../../data/management/cart.management";
import { CartItemModel, CartModel, CartShopModel } from "@/src/data/model/cart.model";
import { AppConfig } from "@/src/common/config/app.config";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import CheckboxComponent from "@/src/components/checkbox/checkbox.comp";
import QuantityProductComponent from "@/src/components/quantity-product/quantity-product.comp";

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

    const handleUpdateCartItemQuantity = (cart_shop_id: number, cart_item_id: number, new_quantity: number) => {
        setCart(prev => {
            const updatedCartShops = prev?.cart_shops.map(
                (cart_shop) => {
                    if (cart_shop.id !== cart_shop_id) {
                        return cart_shop;
                    }

                    const updatedCartItems = cart_shop.cart_items.map(
                        cart_item => {
                            if (cart_item.id !== cart_item_id) {
                                return cart_item;
                            }

                            return { ...cart_item, quantity: new_quantity } as CartItemModel;
                        }
                    );

                    return { ...cart_shop, cart_items: updatedCartItems } as CartShopModel;
                }
            )
            return { ...prev, cart_shops: updatedCartShops } as CartModel;
        });
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

    const isShopOutOfStock = (cartItems: CartItemModel[]) => {
        return cartItems.some((cartItem) => {
            const requestedQuantity = cartItem.quantity;
            const stockQuantity = cartItem.product_variant?.stock_quantity ?? 0;
            return requestedQuantity > stockQuantity
        });
    }

    const isAnyItemChecked = () => {
        return Object.values(cartChecked).some(
            cart_shop =>
                cart_shop.checked ||
                Object.values(cart_shop.cart_items || {}).some(Boolean)
        )
    }

    const isAnySelectedOutOfStock = () => {
        return Object.entries(cartChecked).some(
            ([cartShopId, cartShopData]) => {
                const cart_shop = cart?.cart_shops.find(item => item.id.toString() === cartShopId.toString());
                if (!cart_shop || !cartShopData.cart_items) {
                    return false;
                }

                return Object.entries(cartShopData.cart_items).some(
                    ([cartItemId, isChecked]) => {
                        if (!isChecked) return false;

                        const cartItem = cart_shop.cart_items.find(
                            (cart_item: any) => cart_item.id.toString() === cartItemId.toString()
                        );

                        if (!cartItem) return false;

                        return cartItem.quantity > (cartItem.product_variant?.stock_quantity ?? 0);
                    }
                )
            }
        )
    }

    const headerHeight = useHeaderHeight();
    const shouldDisableCheckout = !isAnyItemChecked() || isAnySelectedOutOfStock();
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
                                    <CheckboxComponent
                                        stateChecked={!!cartChecked[item.id]?.checked}
                                        toggleCheckedFunc={(isChecked) => handleToggleCartShop(item.id, item.cart_items, isChecked)}
                                        disabled={isShopOutOfStock(item.cart_items)}
                                    />
                                    <Text style={styles.shopNameText}>{item.shop?.shop_name}</Text>
                                </View>
                                <View style={styles.listCartItemWrapper}>
                                    {item.cart_items.length > 0 &&
                                        item.cart_items.map((cart_item, index) => {
                                            const isOutOfStock = cart_item.quantity > (cart_item.product_variant?.stock_quantity ?? 0);
                                            return (
                                                <View key={`item-${cart_item.id}-${index}`} style={styles.cartItemWrapper}>
                                                    <CheckboxComponent
                                                        stateChecked={!!cartChecked?.[item.id]?.cart_items?.[cart_item.id]}
                                                        toggleCheckedFunc={(isChecked) => handleToggleCartItem(item.id, cart_item.id, isChecked)}
                                                        disabled={isOutOfStock}
                                                    />
                                                    {/* Thông tin cart item */}
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
                                                                <Text style={[styles.stockQuantityText, isOutOfStock && { color: CommonColors.red }]}>
                                                                    Còn lại: {cart_item.product_variant?.stock_quantity ?? 0}
                                                                </Text>
                                                            </View>
                                                            <View style={{ width: 200, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                                                <QuantityProductComponent
                                                                    initialQuantity={cart_item.quantity}
                                                                    min={1}
                                                                    max={cart_item.product_variant?.stock_quantity ?? 99}
                                                                    onQuantityChange={(newQuantity) => handleUpdateCartItemQuantity(item.id, cart_item.id, newQuantity)}
                                                                />
                                                                <TouchableOpacity>
                                                                    <Ionicons name="trash-outline" size={25} color={CommonColors.red} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })
                                    }
                                </View>
                                <View style={styles.devider}></View>
                                <View style={styles.promotionWrapper}>
                                    <TouchableOpacity style={styles.promotionItem}>
                                        <Ionicons name="ticket-outline" size={24} color={CommonColors.red} />
                                        <Text style={styles.promotionText}>Voucher không giới hạn</Text>

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
                <TouchableOpacity
                    disabled={shouldDisableCheckout}
                    style={[
                        styles.checkoutBtn,
                        shouldDisableCheckout && { opacity: 0.7 }
                    ]}
                >
                    <Text style={styles.checkoutBtnText}>Thanh toán</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

const styles = CartStyle;

export default CartScreen;