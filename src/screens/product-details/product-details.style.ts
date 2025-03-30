import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const ProductDetailStyle = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: CommonColors.white,
        gap: 5
    },
    buttonHeader: {
        backgroundColor: 'rgba(0, 0, 0, 0.16)',
        borderRadius: 30,
        padding: 3
    },
    metaInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 5,
    },
    priceAndRatingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        marginLeft: 5,
        fontSize: 14,
        fontFamily: Fonts.POPPINS_REGULAR,
        lineHeight: 19,
        fontWeight: '400',
        color: CommonColors.gray
    },
    soldAndLikeWrapper: {
        flexDirection: 'row',
        gap: 8
    },
    soldTxt: {
        color: CommonColors.lightGray,
        fontSize: 14,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.POPPINS_REGULAR,
        fontWeight: '400',
        paddingHorizontal: 20,
        color: CommonColors.black,
        letterSpacing: 0.6,
        lineHeight: 32
    },
    priceWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    price: {
        fontSize: 18,
        fontFamily: Fonts.POPPINS_BOLD,
        fontWeight: '600',
        lineHeight: 26,
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
    variantWrapper: {

    },
    variantInfoWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        gap: 5
    },
    variantText: {
        fontSize: 14
    },
    descriptionWrapper: {

    },
    descHeader: {
        paddingHorizontal: 20,
    },
    descTxt: {
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        fontWeight: '500'
    },
    shopWrapper: {
        height: 70,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    shopInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    shopContent: {
        justifyContent: 'space-between',
        height: 50
    },
    shopNameText: {
        fontSize: 16,
        fontWeight: '700'
    },
    shopAddressText: {
        fontSize: 13,
        color: CommonColors.gray
    },
    productShopWrapper: {
        paddingHorizontal: 20,
        gap: 10
    },
    productShopText: {
        fontSize: 15,
        fontWeight: '700'
    },
    buttonShopView: {
        borderWidth: 1,
        borderColor: CommonColors.primary,
        padding: 6,
        borderRadius: 4
    },
    buttonShopViewText: {
        color: CommonColors.primary
    },
    devider: {
        borderBottomWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.16)'
    },

    // productVariantWrapper: {
    //     flexDirection: 'row',
    //     marginTop: 20,
    //     flexWrap: 'wrap',
    // },
    // productVariantType: {
    //     width: '50%',
    //     gap: 5,
    //     marginBottom: 10
    // },
    // productVariantTitle: {
    //     fontSize: 16,
    //     fontWeight: '500',
    //     fontFamily: Fonts.POPPINS_MEDIUM,
    //     color: CommonColors.black
    // },
    // productVariantValueWrapper: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     gap: 5,
    //     flexWrap: 'wrap'
    // },
    // productVariantColorValue: {
    //     width: 30,
    //     height: 30,
    //     borderRadius: 15,
    //     backgroundColor: CommonColors.extraLightGray
    // },
    // productSeletedVariantColor: {
    //     borderColor: CommonColors.primary,
    //     borderWidth: 1,
    //     borderRadius: 100,
    //     padding: 2
    // },
    // productVariantSizeValue: {
    //     width: 50,
    //     height: 30,
    //     borderRadius: 5,
    //     backgroundColor: CommonColors.extraLightGray,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderColor: CommonColors.lightGray,
    //     borderWidth: 1
    // },
    // productVariantSizeValueTxt: {
    //     fontSize: 13,
    //     fontWeight: '500',
    //     fontFamily: Fonts.POPPINS_MEDIUM,
    //     lineHeight: 18,
    //     color: CommonColors.black
    // },
    // productSeletedVariantSize: {
    //     borderColor: CommonColors.primary
    // },
    // productSeletedVariantSizeTxt: {
    //     color: CommonColors.primary,
    //     fontFamily: Fonts.POPPINS_BOLD,
    // },
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
    },


    selectVariantWrapper: {
        gap: 10
    },
    selectVariantInfoWrapper: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        gap: 15
    },
    selectVariantImageWrapper: {
        width: 100,
        height: 100,
        // backgroundColor: 'red',
        borderRadius: 5
    },
    selectVariantImage: {
        width: '100%',
        height: '100%'
    },
    unitPriceAndStockWrapper: {

    },
    unitPriceWrapper: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    dText: {
        fontSize: 15,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    unitPriceText: {
        fontSize: 20,
        color: CommonColors.primary,
        fontWeight: '700'
    },
    stockText: {
        fontSize: 16,
        color: CommonColors.gray
    },
    productVariantWrapper: {
        paddingHorizontal: 20
    },
    productVariantTypeWrapper: {
        gap: 10
    },
    productVariantTitle: {
        fontSize: 16
    },
    productVariantValueWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15,
    },
    productVariantValue: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 1.5,
        borderColor: CommonColors.lightGray,
        borderRadius: 5,
    },
    productVariantImage: {
        width: 30,
        height: 30,
        resizeMode: 'stretch'
    },
    selectedVariant: {
        borderColor: CommonColors.primary
    },
    selectedVariantText: {
        color: CommonColors.primary
    },
    quantityWrapper: {},
    quantityButton: {},

})

export default ProductDetailStyle;