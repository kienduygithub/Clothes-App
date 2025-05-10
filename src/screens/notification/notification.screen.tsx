import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import NotificationStyle from "./notification.style";
import { useHeaderHeight } from "@react-navigation/elements"
import { Ionicons } from "@expo/vector-icons";
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
        }
    }, [])


    const fetchNotifications = async (page: number) => {
        try {
            if (!userSelector.isLogged || isEndReachedList.current) {
                return;
            }

            isFetching.current = true;
            const response = await NotificationMana.fetchNotificationByUser(page, pagination.limit);
            setNotifications(response.get('notifications'));
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
        fetchNotifications(1);
    }, [])

    const headerHeight = useHeaderHeight();
    return (
        <>
            <View style={[styles.container, { marginTop: headerHeight }]}>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ index, item }) => (
                        <Animated.View style={styles.notificationWrapper} entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                            <View style={styles.notificationIcon}>
                                <Ionicons name="notifications-outline" size={20} color={CommonColors.black} />
                            </View>
                            <View style={styles.notificationInfo}>
                                <View style={styles.notificationInfoContent}>
                                    <Text style={styles.notificationTitle}>
                                        {item.type}
                                    </Text>
                                    <Text style={styles.notificationTimeAgo}>{formatDate(item.created_at ?? new Date())}</Text>

                                </View>
                                <Text style={styles.notificationMessage}>
                                    Không có
                                </Text>
                            </View>
                        </Animated.View>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refresh} onRefresh={() => handleRefreshNotifications()} />
                    }
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="notifications-off-outline" size={50} color={CommonColors.gray} />
                            <Text style={styles.emptyText}>Không có thông báo nào</Text>
                        </View>
                    )}
                />
            </View>
        </>
    );
};

const styles = NotificationStyle;

export default NotificationScreen;
