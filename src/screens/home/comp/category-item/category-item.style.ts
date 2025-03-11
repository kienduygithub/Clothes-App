import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const CategoryItemComponentStyle = StyleSheet.create({
    itemContainer: {
        marginVertical: 10,
        gap: 5,
        alignItems: 'center',
        marginLeft: 20
    },
    itemImg: {
        width: 50,
        height: 50,
        borderRadius: '50%',
        backgroundColor: CommonColors.gray
    },
    itemTxt: {
        fontFamily: Fonts.POPPINS_REGULAR
    }
})

export default CategoryItemComponentStyle;