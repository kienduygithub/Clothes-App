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
    headerr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerText: {
        color: '#999',
    },
    resetText: {
        color: 'red',
    },
    step: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginRight: 8,
    },
    stepText: {
        fontSize: 16,
    },
    wardBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'red',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    wardText: {
        color: 'red',
        marginLeft: 8,
        fontSize: 16,
    },
});

export default AddressStyle;