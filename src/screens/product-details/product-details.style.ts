import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const ProductDetailStyle = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    rating: {
        marginLeft: 5,
        fontSize: 14,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        color: CommonColors.gray
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        color: CommonColors.black,
        letterSpacing: 0.6,
        lineHeight: 32
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 5
    },
    price: {
        fontSize: 18,
        fontFamily: Fonts.POPPINS_BOLD,
        fontWeight: '600',
        color: CommonColors.black
    },
    priceDiscount: {
        backgroundColor: CommonColors.extraLightGray,
        padding: 5,
        borderRadius: 5
    },
    priceDiscountTxt: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        color: CommonColors.primary
    },
    oldPrice: {
        fontSize: 16,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        textDecorationLine: 'line-through',
        color: CommonColors.gray
    },
    description: {
        marginTop: 20,
        fontSize: 16,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        color: CommonColors.black,
        letterSpacing: 0.6,
        lineHeight: 24
    },
    productVariantWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        flexWrap: 'wrap',
    },
    productVariantType: {
        width: '50%',
        gap: 5,
        marginBottom: 10
    },
    productVariantTitle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        color: CommonColors.black
    },
    productVariantValueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flexWrap: 'wrap'
    },
    productVariantColorValue: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: CommonColors.extraLightGray
    },
    productSeletedVariantColor: {
        borderColor: CommonColors.primary,
        borderWidth: 1,
        borderRadius: 100,
        padding: 2
    },
    productVariantSizeValue: {
        width: 50,
        height: 30,
        borderRadius: 5,
        backgroundColor: CommonColors.extraLightGray,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: CommonColors.lightGray,
        borderWidth: 1
    },
    productVariantSizeValueTxt: {
        fontSize: 13,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 18,
        color: CommonColors.black
    },
    productSeletedVariantSize: {
        borderColor: CommonColors.primary
    },
    productSeletedVariantSizeTxt: {
        color: CommonColors.primary,
        fontFamily: Fonts.POPPINS_BOLD,
    },
    buttonWrapper: {
        position: 'absolute',
        height: 90,
        padding: 20,
        bottom: 0,
        width: "100%",
        backgroundColor: CommonColors.white,
        flexDirection: 'row',
        gap: 10
    },
    button: {
        flex: 1,
        backgroundColor: CommonColors.primary,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        gap: 5,
        elevation: 5,
        shadowColor: CommonColors.black,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84
    },
    buttonTxt: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        color: CommonColors.white
    }

})

export default ProductDetailStyle;