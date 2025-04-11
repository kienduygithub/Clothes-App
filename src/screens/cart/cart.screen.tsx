import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import CartStyle from "./cart.style";
import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as CartManagement from "../../data/management/cart.management";
import { CartItemModel, CartModel, CartShopModel } from "@/src/data/model/cart.model";
import { AppConfig } from "@/src/common/config/app.config";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import CheckboxComponent from "@/src/components/checkbox/checkbox.comp";
import QuantityProductComponent from "@/src/components/quantity-product/quantity-product.comp";
import { useToast } from "@/src/customize/toast.context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import VariantSelectComponent from "./comp/variant-select/variant-select.component";
import { ProductVariantModel } from "@/src/data/model/product_variant.model";
import CouponSelectComponent from "./comp/coupon-select/coupon-select.component";


type Props = {}

const CartScreen = (props: Props) => {
    const { showToast } = useToast();
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<CartModel>();
    const [selectedCartShop, setSelectedCartShop] = useState<CartShopModel | null>(null);
    const [selectedCartShopId, setSelectedCartShopId] = useState<number>(0);
    const [selectedCartItem, setSelectedCartItem] = useState<CartItemModel | null>(null);
    const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
    const [selectedCartShops, setSelectedCartShops] = useState<Record<string, boolean>>({});
    const sheetVarientSelectRef = useRef<BottomSheet>(null);
    const sheetCouponSelectRef = useRef<BottomSheet>(null);
    const snapPoints = ["50%"];

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
            showToast('Hệ thống đang bận', "error");
        }

        setRefreshing(false);
        setLoading(false);
    }

    const handleRefreshCart = useCallback(() => {
        setRefreshing(true);
        fetchCartByUser();
    }, [])

    const handleToggleCartShop = (cartShopId: number, isChecked: boolean) => {
        setSelectedCartShops(prev => {
            const updatedShops = { ...prev, [cartShopId]: isChecked };

            // Cập nhật tất cả cart_items trong cartShop này
            setSelectedItems(prevItems => {
                const updatedItems = { ...prevItems };
                const cartShop = cart?.cart_shops?.find(shop => shop.id === cartShopId);
                if (cartShop) {
                    cartShop.cart_items.forEach(item => {
                        updatedItems[`${cartShopId}-${item.id}`] = isChecked;
                    });
                }

                return updatedItems;
            });

            return updatedShops;
        });
    }

    const handleToggleCartItem = (cartShopId: number, cartItemId: number, isChecked: boolean) => {
        setSelectedItems(prev => {
            const updated = {
                ...prev,
                [`${cartShopId}-${cartItemId}`]: isChecked
            };

            const cart_shop = cart?.cart_shops.find(cartShop => cartShop.id === cartShopId);
            if (cart_shop) {
                const isAllCartItemSelected = cart_shop.cart_items.every(item => updated[`${cartShopId}-${item.id}`])
                setSelectedCartShops(prevCartShops => ({
                    ...prevCartShops,
                    [cartShopId]: isAllCartItemSelected
                }))
            }

            return updated;
        })
    }

    const handleUpdateCartItemQuantity = async (
        cart_shop_id: number,
        cart_item_id: number,
        new_quantity: number
    ) => {
        try {
            await CartManagement.updateQuantityCartItem(cart_item_id, new_quantity);
            setCart(prevCart => {
                const updatedCart = { ...prevCart } as CartModel;
                const cartShop = updatedCart.cart_shops?.find(
                    shop => shop.id === cart_shop_id
                );

                if (cartShop) {
                    const cartItem = cartShop.cart_items.find(
                        item => item.id === cart_item_id
                    );

                    if (cartItem) {
                        cartItem.quantity = new_quantity;
                    }
                }

                return updatedCart;
            });
        } catch (error) {
            console.log(error);
            showToast('Hệ thống đang bận', "error");
        }
    }

    const calculatePaymentTotal = (): number => {
        let total = 0;

        cart?.cart_shops.forEach(cartShop => {
            cartShop.cart_items.forEach(cart_item => {
                if (selectedItems[`${cartShop.id}-${cart_item.id}`]) {
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

    const isCartEmpty = () => {
        return cart?.cart_shops.every(
            cart_shop => cart_shop.cart_items.every(
                cart_item => !selectedItems[`${cart_shop.id}-${cart_item.id}`]
            )
        )
    }

    const isAnySelectedOutOfStock = () => {
        return cart?.cart_shops.some(
            cart_shop => cart_shop.cart_items.some(
                cart_item =>
                    selectedItems[`${cart_shop.id}-${cart_item.id}`]
                    && cart_item.quantity > (cart_item.product_variant?.stock_quantity ?? 0)
            )
        )
    }

    const handleCheckout = async () => {
        if (isCartEmpty()) {
            console.log('Vui lòng chọn ít nhất một sản phẩm để thanh toán');
            return;
        }

        if (isAnySelectedOutOfStock()) {
            console.log('Một số sản phẩm không đủ số lượng để thanh toán');
            return;
        }

        const newOrder = cart?.cart_shops.map(
            (cart_shop) => ({
                id: cart_shop.id,
                shop: cart_shop.shop,
                cart_items: cart_shop.cart_items.filter(
                    cart_item => selectedItems[`${cart_shop.id}-${cart_item.id}`]
                )
            })
        );
        console.log(newOrder);
    }

    const handleRemoveCartItem = async (cart_shop_id: number, cart_item_id: number) => {
        try {
            await CartManagement.removeCartItem(cart_item_id);
            setCart(prevCart => {
                if (!prevCart) return prevCart;

                const updatedCartShops = prevCart.cart_shops.map(
                    cart_shop => {
                        if (cart_shop.id !== cart_shop_id) {
                            return cart_shop;
                        }

                        const updatedItems = cart_shop.cart_items.filter(
                            item => item.id !== cart_item_id
                        );

                        return {
                            ...cart_shop,
                            cart_items: updatedItems
                        }
                    }
                ) // Loại bỏ cart_shop nếu không còn cart_items
                    .filter(cart_shop => cart_shop.cart_items.length > 0);

                return {
                    ...prevCart,
                    cart_shops: updatedCartShops
                } as CartModel
            })
            showToast('Loại bỏ sản phẩm thành công', "success");
        } catch (error) {
            console.log(error);
            showToast('Hệ thống đang bận', "error");
        }
    }

    const openVariantSelect = (cart_shop_id: number, cart_item: CartItemModel) => {
        setSelectedCartShopId(cart_shop_id);
        setSelectedCartItem(cart_item);
        openSheet("variant", 1);
    }

    const handleChangeVariantCartItem = (
        cart_shop_id: number,
        cart_item_id: number,
        variant: ProductVariantModel,
        quantity: number
    ) => {
        setCart(prevCart => {
            const updatedCart = { ...prevCart } as CartModel;
            const cartShop = updatedCart.cart_shops?.find(
                shop => shop.id === cart_shop_id
            );

            if (cartShop) {
                const cartItem = cartShop.cart_items.find(
                    item => item.id === cart_item_id
                );

                if (cartItem) {
                    cartItem.product_variant = variant;
                    cartItem.quantity = quantity;
                }
            }

            return updatedCart;
        });
        setSelectedCartItem(null);
        setSelectedCartShopId(0);
        sheetVarientSelectRef.current?.close();
    }

    const openCouponSelect = (cartShop: CartShopModel) => {
        setSelectedCartShop(cartShop);
        openSheet("coupon", 1);
    }

    const openSheet = useCallback((sheetType: "variant" | "coupon", index: number) => {
        if (sheetType === "variant") {
            sheetVarientSelectRef.current?.snapToIndex(index);
        } else if (sheetType === "coupon") {
            sheetCouponSelectRef.current?.snapToIndex(index);
        }
    }, []);

    const handleSheetChange = (index: number) => {
        if (index === -1) {
            setSelectedCartShop(null);
            setSelectedCartItem(null);
            setSelectedCartShopId(0);
        }
    }

    const headerHeight = useHeaderHeight();
    const shouldDisableCheckout = isCartEmpty() || isAnySelectedOutOfStock();

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Giỏ hàng',
                    headerTitleAlign: "center",
                    headerTransparent: true,
                }}
            />
            <GestureHandlerRootView>
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
                                            stateChecked={selectedCartShops[item.id]}
                                            toggleCheckedFunc={(isChecked) => handleToggleCartShop(item.id, isChecked)}
                                            disabled={isShopOutOfStock(item.cart_items)}
                                        />
                                        <Text style={styles.shopNameText}>{item.shop?.shop_name}</Text>
                                    </View>
                                    <View style={styles.listCartItemWrapper}>
                                        {item.cart_items.map((cart_item, index) => {
                                            const isOutOfStock = cart_item.quantity > (cart_item.product_variant?.stock_quantity ?? 0);
                                            return (
                                                <View key={`item-${cart_item.id}-${index}`} style={styles.cartItemWrapper}>
                                                    <CheckboxComponent
                                                        stateChecked={selectedItems[`${item.id}-${cart_item.id}`]}
                                                        toggleCheckedFunc={(isChecked) => handleToggleCartItem(item.id, cart_item.id, isChecked)}
                                                        disabled={isOutOfStock}
                                                    />
                                                    {/* Thông tin cart item */}
                                                    <View style={styles.cartItemInfo}>
                                                        <Image style={styles.cartItemImage} source={{ uri: `${preImage}/${cart_item.product_variant?.image_url}` }} />
                                                        <View style={styles.cartItemContent}>
                                                            <Text style={styles.cartItemNameText}>{cart_item.product_variant?.product?.product_name}</Text>
                                                            <TouchableOpacity
                                                                style={styles.changeVariantBtn}
                                                                onPress={() => openVariantSelect(item.id, cart_item)}
                                                            >
                                                                <Text>
                                                                    {`Màu ${cart_item.product_variant?.color?.color_name}, Size ${cart_item.product_variant?.size?.size_code}`}
                                                                </Text>
                                                                <MaterialIcons name="keyboard-arrow-down" size={18} color="black" />
                                                            </TouchableOpacity>
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
                                                                <TouchableOpacity onPress={() => handleRemoveCartItem(item.id, cart_item.id)}>
                                                                    <Ionicons name="trash-outline" size={25} color={CommonColors.red} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                        })}
                                    </View>
                                    <View style={styles.devider}></View>
                                    <View style={styles.promotionWrapper}>
                                        <TouchableOpacity
                                            style={styles.promotionItem}
                                            onPress={() => openCouponSelect(item)}
                                        >
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
                    {cart && cart.cart_shops.length === 0 && (
                        <Animated.View style={styles.emptyCartContainer}>
                            <Image
                                style={styles.emptyCartImage}
                                source={require('@/assets/images/icon_empty_cart.png')}
                            />
                            <Text style={styles.emptyCartText}>Giỏ hàng của bạn còn trống</Text>
                            <TouchableOpacity
                                style={styles.shopNowButton}
                                onPress={() => router.navigate("/(tabs)")}
                            >
                                <Text style={styles.shopNowButtonText}>Mua sắm ngay</Text>
                            </TouchableOpacity>
                        </Animated.View>
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
                        onPress={() => handleCheckout()}
                    >
                        <Text style={styles.checkoutBtnText}>Thanh toán</Text>
                    </TouchableOpacity>
                </Animated.View>
                {/* Bottom sheet */}
                <BottomSheet
                    ref={sheetVarientSelectRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    index={-1}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                    )}
                    onChange={handleSheetChange}
                >
                    <BottomSheetView>
                        <VariantSelectComponent
                            selectedCartItem={selectedCartItem}
                            selectedCartShopId={selectedCartShopId}
                            preImage={preImage}
                            setChangeVariantCartItem={handleChangeVariantCartItem}
                        />
                    </BottomSheetView>
                </BottomSheet>
                <BottomSheet
                    ref={sheetCouponSelectRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    index={1}
                    backdropComponent={(props) => (
                        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                    )}
                    onChange={handleSheetChange}
                >
                    <BottomSheetView>
                        <CouponSelectComponent
                            selectedCartShop={selectedCartShop}
                            preImage={preImage}
                        />
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </>
    )
}

const styles = CartStyle;

export default CartScreen;