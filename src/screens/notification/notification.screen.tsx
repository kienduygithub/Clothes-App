import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import NotificationStyle from "./notification.style";
import { useHeaderHeight } from "@react-navigation/elements"
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { NotificationModel } from "@/src/data/model/notification.model";
import { formatDate } from "@/src/common/utils/time.helper";
import { useDispatch, useSelector } from "react-redux";
import { NotificationStoreState } from "@/src/data/store/reducers/notification/notification.reducer";
import { RootState } from "@/src/data/types/global";
import { PaginateModel } from "@/src/common/model/paginate.model";
import * as NotificationMana from "@/src/data/management/notification.management";
import * as NotificationActions from "@/src/data/store/actions/notification/notification.action";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { NotificationType } from "@/src/common/resource/notification";
import { LinearGradient } from "expo-linear-gradient";
import { formatPriceRender } from "@/src/common/utils/currency.helper";

const NotificationScreen = () => {
    const dispatch = useDispatch();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const notificationSelector: NotificationStoreState = useSelector((state: RootState) => state.notification);
    const [notifications, setNotifications] = useState<NotificationModel[]>([]);
    const initPaginate = new PaginateModel().convertObj({
        currentPage: 1,
        limit: 2,
        totalItems: 0,
        totalPages: 1
    })
    const [pagination, setPagination] = useState<PaginateModel>(initPaginate);
    const [refresh, setRefresh] = useState(false);
    const isEndReachedList = useRef(false);
    const isFetching = useRef(false);

    useEffect(() => {
        if (!notificationSelector.isLoaded) {
            fetchNotifications(1);
        } else {
            setNotifications(notificationSelector.notifications);
        }
    }, []);


    const fetchNotifications = async (page: number) => {
        try {
            if (!userSelector.isLogged || isEndReachedList.current || isFetching.current) {
                return;
            }

            isFetching.current = true;
            const response = await NotificationMana.fetchNotificationByUser(page, pagination.limit);
            setNotifications(prev => [...prev, ...response.get('notifications')]);
            dispatch(NotificationActions.SaveNotifications(response.get('notifications')));

            setPagination(response.get('pagination'));
            if (page >= response.get('pagination')?.totalPages) {
                isEndReachedList.current = true;
            }
        } catch (error) {
            console.log(error);
        } finally {
            isFetching.current = false;
            setRefresh(false);
        }
    }

    const handleRefreshNotifications = useCallback(() => {
        setRefresh(true);
        setNotifications([]);
        isEndReachedList.current = false;
        fetchNotifications(1);
    }, [])

    const handleLoadMore = () => {
        if (!isEndReachedList.current && !isFetching.current && pagination.currentPage <= pagination.totalPages) {
            fetchNotifications(pagination.currentPage + 1);
        }
    };

    const renderNotificationItem = ({ item, index }: { item: NotificationModel; index: number }) => {
        const isUnread = !item.is_read;
        const timeAgo = formatDate(item.created_at ?? new Date());

        let icon = (
            <Feather name="package" size={24} color={CommonColors.primary} />
        )
        let title = "";
        let message = "";

        if (item.type === NotificationType.ORDER_NEW) {
            title = "Đơn hàng mới";
            message = `Bạn đã mua ${item.data?.order_id ? `#${item.data.order_id}` : ''} thành công. Tổng: ${formatPriceRender(item.data?.order_total ?? 0)} VNĐ`;
        } else if (item.type === NotificationType.ORDER_CANCELED) {
            icon = (
                <Feather name="x-octagon" size={24} color={CommonColors.red} />
            )
            title = "Hủy đơn hàng";
            message = `Đơn hàng ${item.data?.order_id ? `#${item.data.order_id}` : ''} đã bị hủy ${item.data?.reason ? `(${item.data.reason})` : ''}.`;
        }

        return (
            <Animated.View entering={FadeInDown.delay(index * 100).duration(300)} style={styles.notificationItem}>
                <View style={styles.iconContainer}>
                    {icon}
                </View>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <Text style={styles.time}>{timeAgo}</Text>
                </View>
                {isUnread && <View style={styles.unreadDot} />}
            </Animated.View>
        );
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;
    return (
        <LinearGradient
            colors={['rgba(240,248,255,0.95)', 'rgba(224,242,254,0.95)']}
            style={{ flex: 1 }}
        >
            <View style={[styles.container]}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Thông báo {unreadCount > 0 ? `(${unreadCount})` : ''}</Text>
                </View>
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refresh} onRefresh={handleRefreshNotifications} />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.1}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>Không có thông báo nào</Text>
                    }
                />
            </View>
        </LinearGradient>
    );
};

const styles = NotificationStyle;

export default NotificationScreen;
