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
        paddingTop: 16,
        backgroundColor: '#f4f4f4',
    },
    section: {
        backgroundColor: CommonColors.white,
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    column: {
        position: 'relative',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 8,
        marginHorizontal: 0
    },
    activeRow: {
        backgroundColor: CommonColors.white,
        zIndex: 2,
        height: 50,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    dotColumn: {
        width: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        backgroundColor: CommonColors.white,
        position: 'relative',
    },
    dotColumnActive: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: CommonColors.primary,
        borderRadius: 30
    },
    verticalLine: {
        position: 'absolute',
        width: 2,
        backgroundColor: '#CCC',
        left: 13, // Đã căn giữa với dot
        zIndex: 1, // Dưới activeRow nhưng trên nền chính
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 30,
        backgroundColor: '#DDD',
        padding: 4,
        zIndex: 3, // Đảm bảo dot luôn ở trên cùng
    },
    textColumn: {
        flex: 1,
    },
    text: {
        fontSize: 14,
        color: '#333',
    },
    activeBorder: {
        position: 'absolute',
        left: 5,
        right: 5,
        height: 50,
        borderWidth: 1,
        borderColor: CommonColors.primary,
        borderRadius: 8,
        zIndex: 2,
    },
    reset: {
        marginTop: 16,
        textAlign: 'center',
        color: '#007AFF',
        fontWeight: '500',
    },




    /** List */
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    listItemText: {
        fontSize: 16,
        color: '#333',
    },
});

export default AddressStyle;