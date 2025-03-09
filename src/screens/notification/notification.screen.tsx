import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import NotificationStyle from "./styles/notification.style";

const NotificationScreen = () => {
    let { id: paramId } = useLocalSearchParams();
    const [id, setId] = useState(paramId ?? "0");
    useFocusEffect(
        useCallback(() => {
            setId("100");
        }, [])
    );

    return (
        <View style={style.container}>
            <Text>Màn hình thông báo: {id}</Text>
        </View>
    );
};

const style = NotificationStyle;

export default NotificationScreen;
