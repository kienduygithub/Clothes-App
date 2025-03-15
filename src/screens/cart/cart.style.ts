import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const CartStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    loadingWrapper: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    loadingText: {
        fontSize: 14,
        color: CommonColors.primary
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: CommonColors.white,
    },
    priceInfoWrapper: {
        flex: 1,
        justifyContent: 'center'
    },
    totalText: {
        fontSize: 16,
        fontWeight: '500',
        color: CommonColors.black
    },
    checkoutBtn: {
        flex: 1,
        backgroundColor: CommonColors.primary,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    checkoutBtnText: {
        fontSize: 15,
        fontWeight: '500',
        color: CommonColors.white,
        lineHeight: 24,
        fontFamily: Fonts.POPPINS_MEDIUM
    }
});

export default CartStyle;