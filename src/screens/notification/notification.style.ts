import { CommonColors } from "@/src/common/resource/colors";
import { Fonts } from "@/src/common/resource/fonts";
import { StyleSheet } from "react-native";

const NotificationStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20
    },
    notificationWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: CommonColors.lightGray,
        backgroundColor: CommonColors.extraLightGray,
        borderRadius: 5
    },
    notificationIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    notificationInfo: {
        flex: 1
    },
    notificationInfoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '500',
        fontFamily: Fonts.POPPINS_MEDIUM,
        lineHeight: 24,
        color: CommonColors.black
    },
    notificationTimeAgo: {
        fontSize: 14,
        color: CommonColors.gray,
        fontFamily: Fonts.POPPINS_REGULAR,
        lineHeight: 22,
        letterSpacing: 0
    },
    notificationMessage: {
        fontSize: 14,
        color: CommonColors.gray,
        fontFamily: Fonts.POPPINS_REGULAR,
        lineHeight: 22,
        letterSpacing: 0
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: CommonColors.gray,
    },
    loadingWrapper: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 16,
        color: CommonColors.primary,
    }
});

export default NotificationStyle;