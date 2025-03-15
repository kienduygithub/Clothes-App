import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const MeStyle = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    infoImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    username: {
        fontSize: 20,
        fontWeight: '500',
        color: CommonColors.black,
        marginTop: 10
    },
    buttonWrapper: {
        marginTop: 20,
        gap: 10
    },
    button: {
        padding: 10,
        borderColor: CommonColors.lightGray,
        borderWidth: 1,
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '500',
        color: CommonColors.black
    }
});

export default MeStyle;