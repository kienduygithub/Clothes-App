import { CommonColors } from "@/src/common/resource/colors";
import { StyleSheet } from "react-native";

const AddressStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    addressContainer: {
        paddingVertical: 15,
        backgroundColor: CommonColors.white,
        paddingHorizontal: 20
    },
    phoneText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        marginVertical: 5,
    },
    defaultLabel: {
        fontSize: 13,
        color: CommonColors.primary,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
    },
    addButtonContainer: {
        paddingVertical: 20,
        paddingHorizontal: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: CommonColors.white
    },
    addButtonText: {
        fontSize: 16,
        color: CommonColors.primary,
        fontWeight: 'bold',
    },



    /** Breadcum */
    containerr: {
        padding: 16,
        backgroundColor: '#fff',
    },
    column: {
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        paddingHorizontal: 8,
    },
    activeRow: {
        backgroundColor: CommonColors.white, // Nền trắng che line
        zIndex: 3, // Che đường line
    },
    dotColumn: {
        width: 30,
        alignItems: 'center',
        position: 'relative',
    },
    verticalLine: {
        position: 'absolute',
        top: 8,
        bottom: -52, // Điều chỉnh độ dài giữa các dot
        width: 2,
        backgroundColor: '#CCC',
        zIndex: -1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#DDD',
    },
    textColumn: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    activeBorder: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 60,
        borderWidth: 1,
        borderColor: '#FF3B30',
        borderRadius: 8,
        zIndex: 0,
    },
    reset: {
        marginTop: 16,
        textAlign: 'center',
        color: '#007AFF',
        fontWeight: '500',
    },
});

export default AddressStyle;