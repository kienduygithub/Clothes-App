import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const FlashSaleComponentStyle = StyleSheet.create({
    container: {
        marginBottom: 20
    },
    titleWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 20
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
    },
    timerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    timer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: CommonColors.highlight,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 12
    },
    timerTxt: {
        color: CommonColors.black,
        fontFamily: Fonts.POPPINS_MEDIUM
    }
})

export default FlashSaleComponentStyle;