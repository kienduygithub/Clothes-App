import { Text, TouchableOpacity, View } from "react-native";
import WelcomeStyle from "./styles/welcome.style";
import { Link, useRouter } from "expo-router";
import { Routes } from "@/src/common/resource/routes";

type Props = {};

const WelcomeScreen = (props: Props) => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text>Màn hình Welcome</Text>

            <TouchableOpacity onPress={() => router.push(Routes.SIGN_IN)}>
                <Text>Tới màn hình đăng nhập</Text>
            </TouchableOpacity>
            <Link href={Routes.SIGN_UP} asChild>
                <TouchableOpacity>
                    <Text>Tới màn hình đăng ký</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
};

const styles = WelcomeStyle;

export default WelcomeScreen;
