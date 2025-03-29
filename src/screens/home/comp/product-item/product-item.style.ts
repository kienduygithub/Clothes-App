import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { Dimensions, StyleSheet } from "react-native";

const width = Dimensions.get('window').width - 40;

const ProductItemStyle = StyleSheet.create({
    container: {
        width: width / 2 - 10,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 15
    },
    productImg: {
        width: '100%',
        height: 220,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    bookmarkBtn: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: 6,
        borderRadius: 20
    },
    title: {
        fontSize: 16,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.black,
        letterSpacing: 1,
        paddingHorizontal: 10,
        marginTop: 5
    },
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 10
    },
    price: {
        fontSize: 16,
        fontFamily: Fonts.POPPINS_BOLD,
        color: CommonColors.primary
    },
    ratingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    ratingTxt: {
        fontSize: 14,
        color: CommonColors.gray,
        fontFamily: Fonts.POPPINS_REGULAR,
        lineHeight: 19
    }
});

export default ProductItemStyle;