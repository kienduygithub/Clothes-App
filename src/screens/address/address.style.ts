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
    },
    column: {
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
    },
    dotColumn: {
        width: 30,
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D3D3D3',
    },
    textColumn: {
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        justifyContent: 'center',
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
        borderWidth: 1.5,
        borderColor: '#FF3B30',
        borderRadius: 8,
        zIndex: -1,
    },
    reset: {
        color: '#FF3B30',
        textAlign: 'right',
        marginTop: 12,
        fontWeight: 'bold',
    },
});

export default AddressStyle;