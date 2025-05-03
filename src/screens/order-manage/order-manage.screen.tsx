import { useEffect, useState } from "react";
import { FlatList, Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import OrderManageStyle from "./order-manage.style";
import { OrderModel } from "@/src/data/model/order.model";
import { getStatusTextAndColorOrder, OrderStatus } from "@/src/common/resource/order_status";
import { mockOrders } from "@/src/data/json/order.data-json";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as OrderManagement from "@/src/data/management/order.management";
import { formatDate } from "@/src/common/utils/time.helper";
import { useToast } from "@/src/customize/toast.context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { MessageError } from "@/src/common/resource/message-error";
import { CommonColors } from "@/src/common/resource/colors";
import { AppConfig } from "@/src/common/config/app.config";
import { formatPriceRender } from "@/src/common/utils/currency.helper";

const OrderManageScreen = () => {
    const preImage = new AppConfig().getPreImage();
    const { showToast } = useToast();
    const tabs = [
        OrderStatus.ALL,
        OrderStatus.PENDING,
        OrderStatus.PAID,
        OrderStatus.SHIPPED,
        OrderStatus.COMPLETED,
        OrderStatus.CANCELED
    ];
    const [activeTab, setActiveTab] = useState(OrderStatus.ALL);
    const [selectedOrder, setSelectedOrder] = useState<OrderModel | null>(null);
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [displayOrders, setDisplayOrders] = useState<OrderModel[]>([]);
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const dispatch = useDispatch();

    useEffect(() => {
        fetchListOrderUser();
    }, [])

    const fetchListOrderUser = async () => {
        try {
            const response = await OrderManagement.fetchFavoritesByUser();
            setOrders(response);
            setDisplayOrders(response);
        } catch (error) {
            console.log('OrderManageScreen 48: ', error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const changeTab = (tab: OrderStatus) => {
        setActiveTab(tab);
        if (tab === OrderStatus.ALL) {
            setDisplayOrders(orders);
            return;
        }
        setDisplayOrders(orders.filter(order => order.status === tab));
    }

    const renderTab = (tab: OrderStatus) => (
        <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
            onPress={() => changeTab(tab)}
        >
            <AntDesign name="carryout" size={25} color={activeTab === tab ? CommonColors.white : CommonColors.black} />
            <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                {getStatusTextAndColorOrder(tab).text}
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
                <Text style={styles.orderDate}>Ngày đặt: {formatDate(new Date(item.created_at ?? ''))}</Text>
                {item.order_shops.map((shop) => (
                    <View key={shop.id} style={styles.shopContainer}>
                        <View style={styles.shopNameContainer}>
                            <MaterialIcons name="store" size={20} color={CommonColors.primary} />
                            <Text style={styles.shopName}>
                                {shop.shop?.shop_name}
                            </Text>
                        </View>
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
                <View style={[styles.modalHeader, { marginHorizontal: 16 }]}>
                    <TouchableOpacity onPress={() => setSelectedOrder(null)}>
                        <MaterialIcons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text style={styles.modalTitle}>Chi tiết đơn hàng #{selectedOrder?.id}</Text>
                </View>
                <ScrollView>
                    <View style={[styles.modalSection, { marginHorizontal: 16 }]}>
                        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>
                        <Text style={styles.modalText}>
                            Ngày đặt: {formatDate(selectedOrder?.created_at ?? new Date())}
                        </Text>
                        <Text style={styles.modalText}>
                            Trạng thái: {getStatusTextAndColorOrder(selectedOrder?.status || '').text}
                        </Text>
                        <Text style={styles.modalText}>
                            Địa chỉ: {`${selectedOrder?.address?.address_detail}, ${selectedOrder?.address?.city?.name}, ${selectedOrder?.address?.district?.name}, ${selectedOrder?.address?.ward?.name}`}
                        </Text>
                    </View>
                    {selectedOrder?.order_shops.map((shop) => (
                        <View key={shop.id} style={[styles.shopDetail, { marginHorizontal: 16 }]}>
                            <View style={styles.shopNameContainer}>
                                <MaterialIcons name="store" size={20} color={CommonColors.primary} />
                                <Text style={styles.shopName}>
                                    {shop.shop?.shop_name}
                                </Text>
                            </View>
                            {shop.order_items.map((item) => (
                                <View key={item.id} style={styles.itemDetail}>
                                    <Image style={styles.itemImage} source={{ uri: `${preImage}/${item.product_variant?.image_url}` }} />
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
                    <View style={[styles.modalSection, { marginHorizontal: 16 }]}>
                        <Text style={styles.sectionTitle}>Tổng đơn hàng</Text>
                        <Text style={styles.orderTotal}>
                            {formatPriceRender(selectedOrder?.total_price ?? 0)} VNĐ
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
                <View style={{ marginBottom: 16 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                        {tabs.map(renderTab)}
                    </ScrollView>
                </View>
                <FlatList
                    data={displayOrders}
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