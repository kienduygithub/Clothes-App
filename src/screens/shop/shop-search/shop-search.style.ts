import { CommonColors } from "@/src/common/resource/colors";
import { Dimensions, StyleSheet } from "react-native";

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const ShopSearchStyle = StyleSheet.create({
    /** Header */
    headerContainer: {
        width: WIDTH_SCREEN,
        height: 100,
        backgroundColor: 'transparent',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        position: 'absolute',
        zIndex: 1000000000000000
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    searchContainer: {
        width: WIDTH_SCREEN * 0.8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 5,
        gap: 10,
        marginLeft: 18
    },
    textTitle: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 1.2
    },

    container: {
        backgroundColor: CommonColors.extraLightGray,
        paddingTop: 10,
    },
    itemsWrapper: {
        width: WIDTH_SCREEN,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        marginBottom: 50,
    },
    productWrapper: {
        width: (WIDTH_SCREEN / 2) - 16,
        marginBottom: 10
    },

    btnSearchMore: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: WIDTH_SCREEN,
        height: 50
    },
    btnSearchMoreText: {
        fontSize: 18,
        color: CommonColors.primary
    },
    emptyText: {
        textAlign: "center",
        color: "#666",
        fontSize: 15
    },
});

export default ShopSearchStyle;