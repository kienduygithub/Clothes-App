import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

const NotificationScreen = () => {
    let { id: paramId } = useLocalSearchParams();
    const [id, setId] = useState(paramId ?? "0");
    useFocusEffect(
        useCallback(() => {
            setId("100");
        }, [])
    );

    return (
        <View>
            <Text>Trang thông báo: {id}</Text>
        </View>
    );
};

export default NotificationScreen;
