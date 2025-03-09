import { Text, View } from "react-native";
import SignUpStyle from "./styles/sign-up.style";

type Props = {};

const SignUpScreen = (props: Props) => {
    return (
        <View style={styles.container}>
            <Text>Màn hình đăng ký</Text>
        </View>
    );
};

const styles = SignUpStyle;

export default SignUpScreen;
