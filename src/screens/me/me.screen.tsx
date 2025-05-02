import { Image, Text, TouchableOpacity, View } from "react-native";
import MeStyle from "./me.style";

import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack, useFocusEffect } from "expo-router";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { useCallback, useEffect, useRef } from "react";
import { AppConfig } from "@/src/common/config/app.config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import * as UserManagement from "@/src/data/management/user.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { useToast } from "@/src/customize/toast.context";
import { MessageError } from "@/src/common/resource/message-error";

type Props = {}

const MeScreen = (props: Props) => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            fetchInfoUser();
        }, [])
    )

    const fetchInfoUser = async () => {
        if (!userSelector.isLogged) {
            return;
        }
        try {
            const userLogged = await UserManagement.fetchInfoUser();
            userLogged.expires = true;
            dispatch(UserActions.UpdateInfoLogged(userLogged));
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Session expired, please log in again') {
                /** Không làm gì cả */
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const navigateToInfoDetailScreen = () => {
        router.navigate("/(routes)/info-detail");
    }

    const logout = async () => {
        try {
            await new AppConfig().clear();
            dispatch(UserActions.ResetInfoLogged());
            dispatch(CartActions.ResetCart());
            router.dismissAll();
            router.navigate({
                pathname: '/(routes)/sign-in'
            });
        } catch (error) {
            console.log(error);
        }
    }

    const navigateFavoriteScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }

        router.navigate('/(routes)/favorite');
    }

    const headerHeight = useHeaderHeight();
    return (
        <>
            <Stack.Screen
                options={{
                    title: "Hồ sơ",
                    headerTitleAlign: 'center',
                    headerTransparent: true
                }}
            />
            <View style={[styles.container, { marginTop: headerHeight }]}>
                <View style={{ alignItems: 'center' }}>
                    {userSelector.image_url === '' ? (
                        <Image
                            source={{ uri: 'https://tiki.vn/blog/wp-content/uploads/2023/01/Y7deW5ZtpOonbiD_XawHLHdkjKYKHvWxvxNZzKdXXn0L8InieLIH_-U5m0u-RUlFtXKp0Ty91Itj4Oxwn_tjKg_UZo3lxFSrOH_DHIbpKP1LDn80z6BbOxj4d8bmymdy8PWFGjLkTpCdoz-3X-KY7IedQ_dxWJlHSIBWwCYhgM02FvUfVUgLKOQxrQWgjw.jpg' }}
                            style={styles.infoImage}
                        />
                    ) : (
                        <Image
                            source={{ uri: `${preImage}/${userSelector.image_url}` }}
                            style={styles.infoImage}
                        />
                    )}
                    <Text style={styles.username}>{userSelector.name === '' ? 'Anonymous' : userSelector.name}</Text>
                </View>

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="person-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Danh sách đơn hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="heart-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText} onPress={() => navigateFavoriteScreen()}>Danh sách mong muốn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => router.navigate('/(routes)/address')}>
                        <FontAwesome name="address-card-o" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Địa chỉ giao hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="card-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Lịch sử thanh toán</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="help-circle-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Chăm sóc khách hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => navigateToInfoDetailScreen()}>
                        <Ionicons name="pencil-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
                    </TouchableOpacity>
                    {(userSelector.isLogged && userSelector.expires) ? (
                        <TouchableOpacity style={styles.button} onPress={() => logout()}>
                            <AntDesign name="logout" size={20} color={CommonColors.black} />
                            <Text style={styles.buttonText}>Đăng xuất</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.button} onPress={() => router.navigate('/(routes)/sign-in')}>
                            <AntDesign name="login" size={20} color={CommonColors.black} />
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = MeStyle;

export default MeScreen;
