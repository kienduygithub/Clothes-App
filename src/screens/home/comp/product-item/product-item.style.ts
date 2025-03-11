import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get('window').width - 40;

const ProductItemStyle = StyleSheet.create({
    container: {
        width: width / 2 - 10,
    },
    productImg: {
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 10
    },
    bookmarkBtn: {
        position: 'absolute',
        right: 15,
        top: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        padding: 5,
        borderRadius: 30
    },
    title: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.black,
        letterSpacing: 1.1
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    price: {
        fontSize: 16,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.primary
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    ratingTxt: {
        fontSize: 14,
        color: CommonColors.gray,
        fontFamily: Fonts.POPPINS_REGULAR
    }
});

export default ProductItemStyle;