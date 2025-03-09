import { Text, TouchableOpacity, View } from "react-native";
import SignInStyle from "./styles/sign-in.style";
import { useRouter } from "expo-router";

const SignInScreen = () => {
    const router = useRouter();
    const navigateToHome = () => {
        router.dismissAll();
        router.push("/(tabs)");
    };
    return (
        <View style={styles.container}>
            <Text>Màn hình đăng nhập</Text>
            <TouchableOpacity onPress={() => navigateToHome()}>
                <Text>Đi tới màn trang chủ</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = SignInStyle;

export default SignInScreen;
