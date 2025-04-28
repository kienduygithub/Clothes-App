import { Text, TouchableOpacity, View } from "react-native";
import SignInStyle from "./sign-in.style";
import { Link, router } from "expo-router";
import InputField from "@/src/components/inputField/inputField.comp";
import { CommonColors } from "@/src/common/resource/colors";
import { Routes } from "@/src/common/resource/routes";
import SocialSignInButtons from "@/src/components/socialSignInButton/socialSignInButtons.comp";
import * as AuthManagement from "../../../data/management/auth.management";
import { AuthModel } from "@/src/data/model/auth.model";
import { Formik } from "formik";
import * as Yup from 'yup';
import FormStyle from "@/src/common/styles/form.styles";
import { HttpCode } from "@/src/common/resource/http-code";
import { AppConfig } from "@/src/common/config/app.config";
import { UserModel } from "@/src/data/model/user.model";
import { useToast } from "@/src/customize/toast.context";
import { useDispatch } from "react-redux";

const signInform = Yup.object().shape({
    email: Yup.string()
        .email('invalidEmail')
        .required('required'),
    password: Yup.string()
        .min(6, 'minLength6')
        .required('required')
})

const SignInScreen = () => {
    const { showToast } = useToast();
    const dispatch = useDispatch();
    const FormValidate = {
        REQUIRED: 'required',
        INVALID_EMAIL: 'invalidEmail',
        MIN_LENGTH_6: 'minLength6',
        INVALID_INFO: 'invalidInfo'
    }
    const handleSignIn = async (
        email: string,
        password: string,
        setErrors: (errors: Record<string, string>) => void
    ) => {
        try {
            let data = new AuthModel(email, password);
            const response = await AuthManagement.signIn(data);
            const userInfo = new UserModel().convertObj(response?.info);
            userInfo.expires = true;
            await new AppConfig().setAccessToken(response.access_token);
            await new AppConfig().setRefreshToken(response.refresh_token);
            await new AppConfig().setUserInfo(userInfo);
            router.dismissTo("/(tabs)");
        } catch (error: any) {
            console.log(error);
            const status = error?.status;
            const message = error?.message;
            if (status === HttpCode.BAD_REQUEST) {
                if (message?.includes('Thông tin đăng nhập không chính xác')) {
                    setErrors({ email: FormValidate.INVALID_INFO });
                }
                return;
            }
            showToast('Oops! Hệ thống đang bận, quay lại sau', "error");
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Đăng nhập tài khoản
            </Text>
            <View style={FormStyle.formContainer}>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={signInform}
                    validateOnChange={true}
                    validateOnBlur={true}
                    onSubmit={(values, { setErrors }) => {
                        handleSignIn(values.email, values.password, setErrors);
                    }}
                >
                    {({ handleChange, handleSubmit, handleBlur, errors, touched }) => {
                        return (
                            <>
                                <View style={FormStyle.inputContainer}>
                                    <InputField
                                        placeholder="Nhập email"
                                        placeholderTextColor={CommonColors.gray}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        invalid={!!(touched.email && errors.email) || errors.email === FormValidate.INVALID_INFO}
                                    />

                                    {touched.email && errors.email === FormValidate.REQUIRED && (
                                        <Text style={FormStyle.valiTextFalse}>Email không được để trống</Text>
                                    )}
                                    {touched.email && errors.email === FormValidate.INVALID_EMAIL && (
                                        <Text style={FormStyle.valiTextFalse}>Email không hợp lệ</Text>
                                    )}
                                    {errors.email === FormValidate.INVALID_INFO && (
                                        <Text style={FormStyle.valiTextFalse}>Thông tin đăng nhập không chính xác</Text>
                                    )}
                                </View>
                                <View style={FormStyle.inputContainer}>
                                    <InputField
                                        placeholder="Nhập mật khẩu"
                                        placeholderTextColor={CommonColors.gray}
                                        secureTextEntry={true}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        invalid={!!(touched.password && errors.password) || errors.email === FormValidate.INVALID_INFO}
                                    />
                                    {touched.password && errors.password === FormValidate.REQUIRED && (
                                        <Text style={FormStyle.valiTextFalse}>Mật khẩu không được để trống</Text>
                                    )}
                                    {touched.password && errors.password === FormValidate.MIN_LENGTH_6 && (
                                        <Text style={FormStyle.valiTextFalse}>Mật khẩu phải có độ dài tối thiểu 6 ký tự</Text>
                                    )}
                                    {errors.email === FormValidate.INVALID_INFO && (
                                        <Text style={FormStyle.valiTextFalse}>Thông tin đăng nhập không chính xác</Text>
                                    )}
                                </View>

                                <TouchableOpacity
                                    style={styles.btn}
                                    onPress={() => handleSubmit()}
                                >
                                    <Text style={styles.btnTxt}>Đăng nhập</Text>
                                </TouchableOpacity>
                            </>
                        )
                    }}
                </Formik>
            </View>
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
