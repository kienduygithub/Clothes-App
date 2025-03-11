import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const CategoryListComponentStyle = StyleSheet.create({
    container: {

    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 20
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.POPPINS_BOLD,
        letterSpacing: 0.6,
        color: CommonColors.black
    },
    titleBtn: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_MEDIUM,
        letterSpacing: 0.6,
        color: CommonColors.black
    }
});

export default CategoryListComponentStyle;