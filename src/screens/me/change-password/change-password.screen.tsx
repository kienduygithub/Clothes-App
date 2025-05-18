import { ActivityIndicator, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useToast } from "@/src/customize/toast.context"
import { Controller, useForm } from "react-hook-form"
import { Gender } from "@/src/common/resource/gender"
import { AppConfig } from "@/src/common/config/app.config"
import * as UserManagement from "@/src/data/management/user.management"
import { useEffect, useRef, useState } from "react"
import { UserModel } from "@/src/data/model/user.model"
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component"
import { CommonColors } from "@/src/common/resource/colors"
import * as ImagePicker from 'expo-image-picker';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import { useDispatch } from "react-redux"
import { MessageError } from "@/src/common/resource/message-error"
import ChangePasswordStyle from "./change-password.style"

type FormData = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
}

type Props = {}

const ChangePasswordScreen = ({

}: Props) => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const [avatarImage, setAvatarImage] = useState('');
    const [image, setImage] = useState<ImagePicker.ImagePickerResult | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const initValueForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    }
    const {
        control,
        handleSubmit: OnSaveForm,
        formState: { errors },
        setValue,
        watch
    } = useForm<FormData>({
        defaultValues: initValueForm,
        mode: 'onChange',
        reValidateMode: 'onChange'
    });

    const saveInfoUser = async (data: FormData) => {
        try {
            setLoading(true);
            setTimeout(() => {
                showToast("Đổi mật khẩu thành công", "success");
            }, 500)
            setLoading(false);
        } catch (error: any) {
            console.log(error);
            setLoading(false);
            if (error?.message === 'Session expired, please log in again') {
                router.navigate('/(routes)/sign-in');
                dispatch(UserActions.UpdateExpiresLogged(false));
                await new AppConfig().clear();
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    return (
        <>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.paymentHeaderText}>
                    Đổi mật khẩu
                </Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={styles.sectionWrapper}>
                    {/* Mật khẩu hiện tại */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Mật khẩu hiện tại</Text>
                        <View style={[styles.inputContainer, errors.currentPassword && styles.inputError]}>
                            <Controller
                                control={control}
                                name="currentPassword"
                                rules={{
                                    required: 'Mật khẩu hiện tại không được bỏ trống',
                                    minLength: {
                                        value: 8,
                                        message: 'Mật khẩu tối thiểu 8 ký tự',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Nhập mật khẩu hiện tại"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                            </View>
                        </View>
                        {errors.currentPassword && (
                            <Text style={styles.error}>
                                {errors.currentPassword.message}
                            </Text>
                        )}
                    </View>
                    {/* Mật khẩu mới */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Mật khẩu mới</Text>
                        <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
                            <Controller
                                control={control}
                                name="newPassword"
                                rules={{
                                    required: 'Mật khẩu mới không được bỏ trống',
                                    minLength: {
                                        value: 8,
                                        message: 'Mật khẩu tối thiểu 8 ký tự',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Nhập mật khẩu mới"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                            </View>
                        </View>
                        {errors.newPassword && (
                            <Text style={styles.error}>
                                {errors.newPassword.message}
                            </Text>
                        )}
                    </View>
                    {/* Xác nhận mật khẩu */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Xác nhận mật khẩu</Text>
                        <View style={[styles.inputContainer, errors.confirmPassword && styles.inputError]}>
                            <Controller
                                control={control}
                                name="confirmPassword"
                                rules={{
                                    required: 'Xác nhận mật khẩu không được bỏ trống',
                                    minLength: {
                                        value: 8,
                                        message: 'Mật khẩu tối thiểu 8 ký tự',
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={styles.input}
                                        value={value}
                                        onChangeText={(text) => onChange(text)}
                                        placeholder="Xác nhận mật khẩu"
                                        autoComplete="off"
                                        autoCorrect={false}
                                        spellCheck={false}
                                        autoFocus={Platform.OS === 'web'}
                                    />
                                )}
                            />
                            <View style={styles.icon}>
                                <FontAwesome5 name="lock" size={16} color={CommonColors.primary} />
                            </View>
                        </View>
                        {errors.confirmPassword && (
                            <Text style={styles.error}>
                                {errors.confirmPassword.message}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.submitButton} onPress={OnSaveForm(saveInfoUser)}>
                        <Text style={styles.submitButtonText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    )
}

const styles = ChangePasswordStyle;

export default ChangePasswordScreen;