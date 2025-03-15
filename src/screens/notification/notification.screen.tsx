import { useFocusEffect } from "@react-navigation/native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import NotificationStyle from "./notification.style";
import { useHeaderHeight } from "@react-navigation/elements"
import { NotificationType } from "@/src/data/types/global";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";
const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    )

    const fetchNotifications = async () => {
        try {
            const url = `http://192.168.0.102:8000/notifications`
            const response = await axios.get(url);
            setNotifications(response.data);
        } catch (error) {
            console.log(error);
        }
    }

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
                />
            </View>
        </>
    );
};

const styles = NotificationStyle;

export default NotificationScreen;
