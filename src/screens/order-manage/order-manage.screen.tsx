import { useState } from "react";
import { FlatList, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import OrderManageStyle from "./order-manage.style";
import { OrderModel } from "@/src/data/model/order.model";
import { getStatusTextAndColorOrder, OrderStatus } from "@/src/common/resource/order_status";
import { mockOrders } from "@/src/data/json/order.data-json";
import { MaterialIcons } from "@expo/vector-icons";

const OrderManageScreen = () => {
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
    const [activeTab, setActiveTab] = useState('Tất cả');
    const tabs = ['Tất cả', OrderStatus.PENDING, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.COMPLETED];
    const filteredOrders = mockOrders.filter(
        (order) => activeTab === 'Tất cả' || order.status === activeTab
    );
    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderTab = (tab: string) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                {tab}
            </Text>
        </TouchableOpacity>
    );

    const renderOrderItem = ({ item }: { item: OrderModel }) => {
        const { text: statusText, color: statusColor } = getStatusTextAndColorOrder(item.status);
        return (
            <TouchableOpacity style={styles.orderCard} onPress={() => setSelectedOrder(item)}>
                <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
                    <Text style={[styles.orderStatus, { color: statusColor }]}>{statusText}</Text>
                </View>
                <Text style={styles.orderDate}>Ngày đặt: {formatDate(item.created_at)}</Text>
                {item.order_shops.map((shop) => (
                    <View key={shop.id} style={styles.shopContainer}>
                        <Text style={styles.shopName}>
                            <MaterialIcons name="store" size={16} color="#FF6200" /> {shop.shop?.shop_name}
                        </Text>
                        {shop.order_items.map((orderItem) => (
                            <Text key={orderItem.id} style={styles.itemPreview}>
                                {orderItem.product_variant?.product?.product_name ?? ''} x{orderItem.quantity}
                            </Text>
                        ))}
                    </View>
                ))}
                <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>
                        Tổng: {item.total_price.toLocaleString('vi-VN')} VNĐ
                    </Text>
                    <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
                </View>
            </TouchableOpacity>
        );
    };

    const renderOrderDetail = () => (
        <Modal
            visible={!!selectedOrder}
            animationType="slide"
            onRequestClose={() => setSelectedOrder(null)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Chi tiết đơn hàng #{selectedOrder?.id}</Text>
                </View>
                <ScrollView>
                    <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                        <Text style={styles.modalText}>
                            Ngày đặt: {formatDate(selectedOrder?.created_at ?? new Date())}
                        </Text>
                        <Text style={styles.modalText}>
                            Trạng thái: {getStatusTextAndColorOrder(selectedOrder?.status || '').text}
                        </Text>
                        <Text style={styles.modalText}>
                            Địa chỉ: {selectedOrder?.address?.address_detail || '-'}
                        </Text>
                    </View>
                    {selectedOrder?.order_shops.map((shop) => (
                        <View key={shop.id} style={styles.shopDetail}>
                            <Text style={styles.shopName}>
                                <MaterialIcons name="store" size={16} color="#FF6200" /> {shop.shop?.shop_name}
                            </Text>
                            {shop.order_items.map((item) => (
                                <View key={item.id} style={styles.itemDetail}>
                                    <Text style={styles.itemName}>{item.product_variant?.product?.product_name}</Text>
                                    <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                    <Text style={styles.itemPrice}>
                                        {(item.product_variant?.product?.unit_price || 0).toLocaleString('vi-VN')} VNĐ
                                    </Text>
                                </View>
                            ))}
                            <View style={styles.shopSummary}>
                                <Text style={styles.shopSubtotal}>
                                    Tạm tính: {shop.subtotal.toLocaleString('vi-VN')} VNĐ
                                </Text>
                                <Text style={styles.shopDiscount}>
                                    Giảm giá: {shop.discount.toLocaleString('vi-VN')} VNĐ
                                </Text>
                                <Text style={styles.shopTotal}>
                                    Tổng cộng: {shop.final_total.toLocaleString('vi-VN')} VNĐ
                                </Text>
                            </View>
                        </View>
                    ))}
                    <View style={styles.modalSection}>
                        <Text style={styles.sectionTitle}>Tổng đơn hàng</Text>
                        <Text style={styles.orderTotal}>
                            {selectedOrder?.total_price.toLocaleString('vi-VN')} VNĐ
                        </Text>
                    </View>
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedOrder(null)}>
                    <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Quản lý đơn hàng</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                    {tabs.map(renderTab)}
                </ScrollView>
                <FlatList
                    data={filteredOrders}
                    renderItem={renderOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
                    }
                />
                {renderOrderDetail()}
            </View>
        </>
    )
}

const styles = OrderManageStyle;

export default OrderManageScreen;