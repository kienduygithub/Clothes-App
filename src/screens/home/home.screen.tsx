import { Fonts } from "@/src/common/resource/fonts";
import { useFonts } from "expo-font";
import { SplashScreen, useNavigation, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const HomeScreen = () => {
    const router = useRouter();
    const [loaded] = useFonts({
        [Fonts.POPPINS_REGULAR]: require("@/assets/fonts/Poppins-Regular.ttf"),
        [Fonts.POPPINS_ITALIC]: require("@/assets/fonts/Poppins-Italic.ttf"),
        [Fonts.POPPINS_BOLD]: require("@/assets/fonts/Poppins-Bold.ttf"),
        [Fonts.POPPINS_LIGHT]: require("@/assets/fonts/Poppins-Light.ttf"),
        [Fonts.POPPINS_MEDIUM]: require("@/assets/fonts/Poppins-Medium.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <View>
            <Text>Trang chủ</Text>
            <TouchableOpacity onPress={() => router.push(`/notification?id=${9}`)}>
                <Text>Trang thông báo</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
