import { StyleSheet } from "react-native";

const OrderManageStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 16,
        marginTop: 8,
    },
    tabContainer: {
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        minWidth: 80,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#FF6200',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    activeTabText: {
        color: '#FFFFFF',
    },
    listContainer: {
        paddingBottom: 16,
    },
    orderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: '500',
    },
    orderDate: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 8,
    },
    shopContainer: {
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 8,
        marginBottom: 8,
    },
    shopName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    itemPreview: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 4,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    orderTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FF6200',
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 32,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginLeft: 8,
    },
    modalSection: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 14,
        color: '#4B5563',
        marginBottom: 4,
    },
    shopDetail: {
        backgroundColor: '#F9FAFB',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    itemDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 14,
        color: '#1F2937',
        flex: 1,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#6B7280',
        marginHorizontal: 8,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1F2937',
    },
    shopSummary: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    shopSubtotal: {
        fontSize: 14,
        color: '#6B7280',
    },
    shopDiscount: {
        fontSize: 14,
        color: '#EF4444',
    },
    shopTotal: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FF6200',
        marginTop: 4,
    },
    closeButton: {
        backgroundColor: '#FF6200',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
})

export default OrderManageStyle;