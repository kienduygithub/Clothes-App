import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const SearchStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        backgroundColor: CommonColors.extraLightGray,
        padding: 10,
        borderRadius: 10,
        marginBottom: 20
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        color: CommonColors.black
    },
    itemImage: {
        width: 100,
        height: 100,
        borderRadius: 10
    }
});

export default SearchStyle;