import { Text, TouchableOpacity, View } from "react-native";
import WelcomeStyle from "./styles/welcome.style";
import { Link, useRouter } from "expo-router";

type Props = {};

const WelcomeScreen = (props: Props) => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text>Màn hình Welcome</Text>

            <TouchableOpacity onPress={() => router.push("/(routes)/sign-in")}>
                <Text>Tới màn hình đăng nhập</Text>
            </TouchableOpacity>
            {/* <Link href={"/(routes)/auth/sign-up"} asChild>
                <TouchableOpacity>
                    <Text>Tới màn hình đăng ký</Text>
                </TouchableOpacity>
            </Link> */}
        </View>
    );
};

const styles = WelcomeStyle;

export default WelcomeScreen;
