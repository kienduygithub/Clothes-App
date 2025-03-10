import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const InputFieldStyle = StyleSheet.create({
    inputField: {
        backgroundColor: CommonColors.white,
        paddingVertical: 12,
        paddingHorizontal: 18,
        alignSelf: 'stretch',
        borderRadius: 5,
        fontSize: 16,
        color: CommonColors.black,
        fontFamily: Fonts.POPPINS_REGULAR,
        marginBottom: 20
    }
});

export default InputFieldStyle;