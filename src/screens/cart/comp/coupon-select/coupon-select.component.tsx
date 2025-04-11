import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { Text, TextInput, View } from "react-native"
import CouponImage from "@/assets/images/icon_coupon.svg";
import { CartShopModel } from "@/src/data/model/cart.model";

type Props = {
    selectedCartShop: CartShopModel | null,
}

const CouponSelectComponent = ({
    selectedCartShop = null
}: Props) => {

    return (
        <View style={styles.bottomSheetContent}>
            <Text style={styles.title}>{selectedCartShop?.shop?.shop_name} Shop Voucher</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập mã voucher của Shop"
                />
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Áp Dụng</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.messageContainer}>
                {/* Thêm icon vào giữa hai dấu chấm */}
                <View style={styles.iconContainer}>
                    <CouponImage style={{ width: 200, height: 200 }}></CouponImage>
                </View>
                <Text style={styles.message}>Chưa có mã giảm giá nào của Shop</Text>
                <Text style={styles.subMessage}>
                    Nhập mã giảm giá có thể sử dụng vào thanh bên trên
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    bottomSheetContent: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
    },
    applyButton: {
        backgroundColor: '#ccc',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    messageContainer: {
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dot: {
        fontSize: 24,
        color: '#666',
        marginHorizontal: 5,
    },
    message: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subMessage: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default CouponSelectComponent;