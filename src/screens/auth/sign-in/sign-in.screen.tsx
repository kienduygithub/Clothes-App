import { Text, TouchableOpacity, View } from "react-native";
import SignInStyle from "./styles/sign-in.style";
import { Link, router } from "expo-router";
import InputField from "@/src/components/inputField/inputField.comp";
import { CommonColors } from "@/src/common/resource/colors";
import { Routes } from "@/src/common/resource/routes";
import SocialSignInButtons from "@/src/components/socialSignInButton/socialSignInButtons.comp";
import * as AuthManagement from "../../../data/management/auth.management";
import { useState } from "react";
import { AuthModel } from "@/src/data/model/auth.model";
import { validEmail } from "@/src/common/utils/auth.validator";

const SignInScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });

    const checkForm = () => {
        if (email.trim() === '' || password.trim() === '') {
            setErrors({
                ...errors,
                email: email.trim() === '',
                password: password.trim() === ''
            });
            return false;
        }

        if (!validEmail(email)) {
            setErrors({
                ...errors,
                email: true
            });
            return false;
        }

        return true;
    }

    const handleSignIn = async () => {
        const validForm = checkForm();
        if (!validForm) {
            console.log("INVALID FORM");
            console.log({
                email: email,
                password: password
            })
            return;
        }

        try {
            let data = new AuthModel(email, password);
            const response = await AuthManagement.signIn(data);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    const navigateToHome = () => {
        // router.dismissAll();
        // router.push("/(tabs)");
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Đăng nhập tài khoản
            </Text>
            <InputField
                placeholder="Nhập email"
                placeholderTextColor={CommonColors.gray}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(value: string) => setEmail(value)}
            />
            <InputField
                placeholder="Nhập mật khẩu"
                placeholderTextColor={CommonColors.gray}
                secureTextEntry={true}
                onChangeText={(value: string) => setPassword(value)}
            />

            <TouchableOpacity
                style={styles.btn}
                onPress={() => handleSignIn()}
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
