import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import PaymentStyle from "./payment.style"
import { router, Stack } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { formatPriceRender } from "@/src/common/utils/currency.helper";
import { AppConfig } from "@/src/common/config/app.config";
import { CartShopFinalType } from "@/src/data/types/global";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, FontAwesome5, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import CheckboxComponent from "@/src/components/checkbox/checkbox.comp";
import { PaymentMethod } from "@/src/common/resource/payment_method";

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
    const [usePaymentMethod, setUsePaymentMethod] = useState(PaymentMethod.COD);

    useEffect(() => {
        fetchPreImage();
    }, [])

    const calculateTotalProduct = () => {
        let total = 0;
        parsedCartShops.forEach(
            cart_shop => total += cart_shop.cart_items.length
        )
        return total;
    }

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
                    showsVerticalScrollIndicator={false}
                >
                    {/* Phần 1: Địa chỉ */}
                    <View style={styles.section}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', gap: 5 }}
                        >
                            <Ionicons name="location-sharp" size={18} color={CommonColors.primary} />
                            <View>
                                <Text style={styles.sectionTitle}>Kiến duy (+84) 839 822 333</Text>
                                <Text style={styles.addressText}>
                                    Dạ Hợp 12 Tầng, Phường Hữu Nghị, Thành Phố Hòa Bình, Hòa Bình
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Phần 2: Chi tiết sản phẩm */}
                    {parsedCartShops.map((cartShop) => (
                        <View key={cartShop.cart_shop_id} style={styles.section}>
                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5 }}>
                                    <Feather name="shopping-bag" size={20} color="black" />
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        style={styles.shopName}
                                    >
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
                                        <Text
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                            style={styles.productName}
                                        >
                                            {item.product_variant?.product?.product_name}
                                        </Text>
                                        <Text style={styles.variant}>
                                            Màu {item.product_variant?.color?.color_name}{', '}
                                            Size {item.product_variant?.size?.size_code}
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
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 15 }}>
                                <Ionicons name="ticket-outline" size={24} color={CommonColors.red} />
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                    style={{ maxWidth: '90%' }}
                                >
                                    {cartShop.selected_coupon.name}
                                </Text>
                                <Text style={styles.quantity}>x1</Text>
                            </View>
                        </View>
                    ))}

                    {/* Phần 3: Phương thức vận chuyển */}
                    <View style={[styles.section, { paddingHorizontal: 0 }]}>
                        <View style={{ paddingHorizontal: 15 }}>
                            <View style={styles.row}>
                                <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
                            </View>
                            <View style={styles.shippingOption}>
                                <Text style={styles.shippingMethod}>NHANH - TIẾT KIỆM</Text>
                                <FontAwesome5 name="wind" size={15} color='#00CED1' />
                            </View>
                            <Text style={styles.shippingDetails}>
                                Đảm bảo nhận hàng nhanh chóng và tiết kiệm
                            </Text>
                        </View>
                        <View style={styles.devider}></View>
                        <View style={[styles.row, { paddingHorizontal: 15 }]}>
                            <Text style={[styles.sectionTitle, { fontWeight: '400' }]}>
                                Tổng số tiền ({calculateTotalProduct()} sản phẩm)
                            </Text>
                            <Text style={[styles.totalAmount, { color: CommonColors.black }]}>đ{formatPriceRender(subtotal)}</Text>
                        </View>
                    </View>

                    {/* Phần 4: Phương thức thanh toán */}
                    <View style={styles.section}>
                        <View style={styles.row}>
                            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
                        </View>
                        <View style={[styles.paymentMethod, { gap: 5 }]}>
                            <TouchableOpacity
                                style={{ position: 'relative' }}
                                onPress={() => setUsePaymentMethod(PaymentMethod.COD)}
                            >
                                <View style={styles.paymentMethodOption}>
                                    <FontAwesome6 name="money-check" size={20} color={CommonColors.primary} />
                                    <Text style={styles.paymentMethodText}>
                                        Thanh toán khi nhận hàng
                                    </Text>
                                </View>
                                <View style={{ position: 'absolute', right: -15, top: 0 }}>
                                    <CheckboxComponent
                                        stateChecked={usePaymentMethod === PaymentMethod.COD}
                                        toggleCheckedFunc={(isChecked) => setUsePaymentMethod(PaymentMethod.COD)}
                                        circle={true}
                                    />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ position: 'relative' }}
                                onPress={() => setUsePaymentMethod(PaymentMethod.PAID)}
                            >
                                <View style={styles.paymentMethodOption}>
                                    <FontAwesome6 name="money-check" size={20} color={CommonColors.primary} />
                                    <Text style={styles.paymentMethodText}>Thanh toán ngay</Text>
                                </View>
                                <View style={{ position: 'absolute', right: -15, top: 0 }}>
                                    <CheckboxComponent
                                        stateChecked={usePaymentMethod === PaymentMethod.PAID}
                                        toggleCheckedFunc={(isChecked) => setUsePaymentMethod(PaymentMethod.PAID)}
                                        circle={true}
                                    />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Phần 5: Chi tiết thanh toán */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
                        <View style={[styles.row, { marginTop: 10 }]}>
                            <Text style={styles.detailLabel}>Tổng tiền hàng</Text>
                            <Text style={styles.detailValue}>đ{formatPriceRender(subtotal)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailLabel}>Giảm giá chiết khấu</Text>
                            <Text style={[styles.detailValue, { color: CommonColors.primary }]}>
                                -đ{formatPriceRender(discount)}
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.detailLabel}>Tổng thanh toán</Text>
                            <Text style={styles.totalAmount}>đ{formatPriceRender(final_total)}</Text>
                        </View>
                    </View>
                    <View style={{ paddingHorizontal: 15 }}>
                        <Text style={styles.termsNote}>
                            Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo <Text style={{ color: CommonColors.primary }}>Điều khoản Fashion Zone.</Text>
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