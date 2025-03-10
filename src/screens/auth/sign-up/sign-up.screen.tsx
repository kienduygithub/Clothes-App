import { Text, TouchableOpacity, View } from "react-native";
import SignUpStyle from "./styles/sign-up.style";
import InputField from "@/src/components/inputField/inputField.comp";
import React from "react";
import { CommonColors } from "@/src/common/resource/colors";
import { Link } from "expo-router";
import { Routes } from "@/src/common/resource/routes";
import SocialSignInButtons from "@/src/components/socialSignInButton/socialSignInButtons.comp";

type Props = {};

const SignUpScreen = (props: Props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Create an account
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
            <InputField
                placeholder="Confirm Password"
                placeholderTextColor={CommonColors.gray}
                secureTextEntry={true}
            />

            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnTxt}>Create an Account</Text>
            </TouchableOpacity>

            <View style={styles.signInWrapper}>
                <Text style={styles.signInTxt}>
                    Bạn đã có tài khoản?
                </Text>
                <Link href={Routes.SIGN_IN} asChild>
                    <TouchableOpacity>
                        <Text style={styles.signInTxtSpan}>Đăng nhập</Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.divider}></View>

            <SocialSignInButtons emailHref={Routes.SIGN_IN} />
        </View>
    );
};

const styles = SignUpStyle;

export default SignUpScreen;
