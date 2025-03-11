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
        color: CommonColors.gray
    }
})

export default ProductDetailStyle;