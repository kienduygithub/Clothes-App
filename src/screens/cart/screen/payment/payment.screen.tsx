import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import PaymentStyle from "./payment.style"
import { router, Stack } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { formatPriceRender } from "@/src/common/utils/currency.helper";
import { AppConfig } from "@/src/common/config/app.config";
import { CartShopFinalType } from "@/src/data/types/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";

type Props = {}

const PaymentScreen = (props: Props) => {
    const route = useRoute();
    const { cart_shops, subtotal, discount, final_total } = route.params as {
        cart_shops: string;
        subtotal: number;
        discount: number;
        final_total: number;
    };
    const [preImage, setPreImage] = useState("");
    const parsedCartShops: CartShopFinalType[] = JSON.parse(cart_shops);
    const [useShopeeCoins, setUseShopeeCoins] = useState(false);

    useEffect(() => {
        fetchPreImage();
    }, [])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Thanh toán',
                    headerTitleAlign: 'center',
                    headerShown: false
                }}
            />
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>Thanh toán</Text>
            </View>
            {/* Phần nội dung cuộn */}
            <View style={styles.safeArea}>
                <ScrollView
                    style={styles.scrollView}
                >
                    {/* Phần 1: Địa chỉ */}
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text style={styles.sectionTitle}>Kiện duy (+84) 839 822 333</Text>
                        </View>
                        <Text style={styles.addressText}>
                            Dạ Hợp 12 Tầng, Phường Hữu Nghị, Thành Phố Hòa Bình, Hòa Bình
                        </Text>
                    </View>

                    {/* Phần 2: Chi tiết sản phẩm */}
                    {parsedCartShops.map((cartShop) => (
                        <View key={cartShop.cart_shop_id} style={styles.section}>
                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
                                    <Feather name="shopping-bag" size={20} color="black" />
                                    <Text style={styles.shopName}>
                                        {/* <Text style={styles.favoriteLabel}>Yêu thích</Text>{' '} */}
                                        {cartShop.shop.shop_name}
                                    </Text>
                                </View>
                            </View>
                            {cartShop.cart_items.map((item) => (
                                <View key={item.id} style={styles.productRow}>
                                    <Image
                                        source={{ uri: `${preImage}/${item.product_variant?.image_url}` }}
                                        style={styles.productImage}
                                    />
                                    <View style={styles.productDetails}>
                                        <Text style={styles.productName}>
                                            {item.product_variant?.product?.product_name}
                                        </Text>
                                        <Text style={styles.variant}>
                                            {item.product_variant?.color?.color_name}{' '}
                                            {item.product_variant?.size?.size_code}
                                        </Text>
                                        <View style={styles.priceRow}>
                                            <Text style={styles.price}>
                                                đ{formatPriceRender(item.product_variant?.product?.unit_price ?? 0)}
                                            </Text>
                                            <Text style={styles.quantity}>x{item.quantity}</Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}

                    {/* Phần 3: Phương thức vận chuyển */}
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
                        </View>
                        <View style={styles.shippingOption}>
                            <Text style={styles.shippingMethod}>NHANH - TIẾT KIỆM</Text>
                        </View>
                        <Text style={styles.shippingDetails}>
                            Đảm bảo nhận hàng nhanh chóng và tiết kiệm
                        </Text>
                    </View>

                    {/* Phần 4: Tổng số tiền */}
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text style={styles.sectionTitle}>Tổng số tiền (1 sản phẩm)</Text>
                            <Text style={styles.totalAmount}>đ{formatPriceRender(final_total)}</Text>
                        </View>
                    </View>

                    {/* Phần 5: Phương thức thanh toán */}
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                        </View>
                        <View style={styles.paymentMethod}>
                            <View style={styles.paymentMethodOption}>
                                <Text style={styles.paymentMethodText}>Thanh toán khi nhận hàng</Text>
                            </View>
                            <View style={styles.paymentMethodOption}>
                                <Text style={styles.paymentMethodText}>Thanh toán ngay</Text>
                            </View>
                        </View>
                    </View>

                    {/* Phần 6: Chi tiết thanh toán */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
                        <View style={styles.row}>
                            <Text style={styles.detailLabel}>Tổng tiền hàng</Text>
                            <Text style={styles.detailValue}>đ{formatPriceRender(subtotal)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailLabel}>Tổng tiền phí vận chuyển</Text>
                            <Text style={styles.detailValue}>đ0</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailLabel}>Giảm giá phí vận chuyển</Text>
                            <Text style={styles.detailValue}>-đ{formatPriceRender(discount)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailLabel}>Tổng thanh toán</Text>
                            <Text style={styles.totalAmount}>đ{formatPriceRender(final_total)}</Text>
                        </View>
                        <Text style={styles.termsNote}>
                            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Fashion Zone.
                        </Text>
                    </View>
                </ScrollView>
            </View>
            {/* Footer: Tổng thanh toán và nút Đặt hàng */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerTotal}>
                        Tổng thanh toán đ{formatPriceRender(final_total)}
                    </Text>
                    <Text style={styles.footerSavings}>Tiết kiệm đ{formatPriceRender(discount)}</Text>
                </View>
                <TouchableOpacity style={styles.orderButton}>
                    <Text style={styles.orderButtonText}>ĐẶT HÀNG</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const styles = PaymentStyle;

export default PaymentScreen;