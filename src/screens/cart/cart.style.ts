import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get('window').width;

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
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
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
    },


    cartShopWrapper: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10
    },
    cartShopHeader: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    checkbox: {
        width: 26,
        height: 26,
        borderColor: 'rgba(0, 0, 0, 0.16)',
        borderWidth: 1,
        borderRadius: 5,
    },
    checkboxChecked: {
        backgroundColor: CommonColors.primary,
    },
    shopNameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000'
    },
    listCartItemWrapper: {
        paddingHorizontal: 10,
        gap: 25
    },
    cartItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cartItemInfo: {
        flexDirection: 'row',
        gap: 15
    },
    cartItemImage: {
        width: 100,
        height: 100
    },
    cartItemContent: {
        paddingVertical: 10,
        justifyContent: 'space-between'
    },
    cartItemNameText: {
        fontSize: 16
    },
    cartItemPriceAndQuantity: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    dText: {
        fontSize: 15,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    priceText: {
        fontSize: 16,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    devider: {
        marginVertical: 15,
        height: 1,
        width: width,
        backgroundColor: CommonColors.extraLightGray
    },
    promotionWrapper: {
        paddingHorizontal: 10
    },
    promotionItem: {
        height: 40,
        width: width,
        flexDirection: 'row',
        gap: 15
    },
    promotionText: {
        fontSize: 15
    },
    stockQuantityText: {
        fontSize: 14,
        color: CommonColors.lightGray
    }
});

export default CartStyle;