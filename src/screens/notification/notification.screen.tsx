import { useFocusEffect } from "@react-navigation/native";
import { Stack } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import NotificationStyle from "./notification.style";
import { useHeaderHeight } from "@react-navigation/elements"
import { NotificationType } from "@/src/data/types/global";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    )

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const url = `http://192.168.0.102:8000/notifications`
            const response = await axios.get(url);
            setNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
        setRefresh(false);
        setLoading(false);
    }

    const handleRefreshNotifications = useCallback(() => {
        setRefresh(true);
        fetchNotifications();
    }, [])

    const headerHeight = useHeaderHeight();
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Thông báo',
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTransparent: true
                }}
            />
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
                                        {item.title}
                                    </Text>
                                    <Text style={styles.notificationTimeAgo}>{item.timestamp}</Text>

                                </View>
                                <Text style={styles.notificationMessage}>
                                    {item.message}
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
