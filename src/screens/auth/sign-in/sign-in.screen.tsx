import { Text, TouchableOpacity, View } from "react-native";
import SignInStyle from "./styles/sign-in.style";
import { Link, useRouter } from "expo-router";
import InputField from "@/src/components/inputField/inputField.comp";
import { CommonColors } from "@/src/common/resource/colors";
import { Routes } from "@/src/common/resource/routes";
import SocialSignInButtons from "@/src/components/socialSignInButton/socialSignInButtons.comp";

const SignInScreen = () => {
    const router = useRouter();
    const navigateToHome = () => {
        router.dismissAll();
        router.push("/(tabs)");
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Đăng nhập tài khoản
            </Text>
            <InputField
                placeholder="Email address"
                placeholderTextColor={CommonColors.gray}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <InputField
                placeholder="Password"
                placeholderTextColor={CommonColors.gray}
                secureTextEntry={true}
            />

            <TouchableOpacity
                style={styles.btn}
                onPress={() => navigateToHome()}
            >
                <Text style={styles.btnTxt}>Đăng nhập</Text>
            </TouchableOpacity>

            <View style={styles.signInWrapper}>
                <Text style={styles.signInTxt}>
                    Bạn chưa có tài khoản?
                </Text>
                <Link href={Routes.SIGN_UP} asChild>
                    <TouchableOpacity>
                        <Text style={styles.signInTxtSpan}>Đăng ký</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.divider}></View>

            <SocialSignInButtons emailHref={Routes.SIGN_IN} />
        </View>
    );
};

const styles = SignInStyle;

export default SignInScreen;
