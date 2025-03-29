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
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3, // Thêm hiệu ứng đổ bóng nhẹ
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: Fonts.POPPINS_MEDIUM,
        color: CommonColors.black,
        marginBottom: 4
    },
    itemCount: {
        fontSize: 14,
        fontFamily: Fonts.POPPINS_REGULAR,
        color: CommonColors.gray
    },
    itemImage: {
        width: 120,
        height: 100,
        borderRadius: 10
    }
});

export default SearchStyle;