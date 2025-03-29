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
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: CommonColors.white
    },
    itemTxt: {
        fontFamily: Fonts.POPPINS_REGULAR
    }
})

export default CategoryItemComponentStyle;