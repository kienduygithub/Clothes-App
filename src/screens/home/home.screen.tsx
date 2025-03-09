import { Fonts } from "@/src/common/resource/fonts";
import { Routes } from "@/src/common/resource/routes";
import { useFonts } from "expo-font";
import { SplashScreen, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "./styles/home.style";

const HomeScreen = () => {
    const router = useRouter();

    return (
        <View style={style.container}>
            <Text>Màn hình trang chủ</Text>
        </View>
    );
};

const style = HomeStyle;

export default HomeScreen;
