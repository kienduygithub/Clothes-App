import { Image, Text, TouchableOpacity, View } from "react-native";
import MeStyle from "./me.style";

import { useHeaderHeight } from "@react-navigation/elements";
import { router, Stack } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import { useEffect, useState } from "react";
import { UserModel } from "@/src/data/model/user.model";
import { AppConfig } from "@/src/common/config/app.config";

type Props = {}

const MeScreen = (props: Props) => {
    const [user, setUser] = useState<UserModel>();
    const preImage = new AppConfig().getPreImage();
    useEffect(() => {
        fetchUserInfo();
    }, [])

    const fetchUserInfo = async () => {
        try {
            const userInfo = await new AppConfig().getUserInfo()
            setUser(userInfo);
        } catch (error) {
            console.log(error);
        }
    }

    const navigateToInfoDetailScreen = () => {
        router.navigate("/(routes)/info-detail");
    }

    const logout = async () => {
        try {
            await new AppConfig().clear();
            router.dismissAll();
            router.navigate({
                pathname: '/(routes)/sign-in'
            });
        } catch (error) {
            console.log(error);
        }
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
                    {/* <Image
                        source={{ uri: 'https://tiki.vn/blog/wp-content/uploads/2023/01/Y7deW5ZtpOonbiD_XawHLHdkjKYKHvWxvxNZzKdXXn0L8InieLIH_-U5m0u-RUlFtXKp0Ty91Itj4Oxwn_tjKg_UZo3lxFSrOH_DHIbpKP1LDn80z6BbOxj4d8bmymdy8PWFGjLkTpCdoz-3X-KY7IedQ_dxWJlHSIBWwCYhgM02FvUfVUgLKOQxrQWgjw.jpg' }}
                        style={styles.infoImage}
                    /> */}
                    <Image
                        source={{ uri: `${preImage}/${user?.image_url}` }}
                        style={styles.infoImage}
                    />
                    <Text style={styles.username}>{user?.name ?? 'Anonymous'}</Text>
                </View>

                <View style={styles.buttonWrapper}>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="person-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Danh sách đơn hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                        <Ionicons name="heart-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Danh sách mong muốn</Text>
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
                    <TouchableOpacity style={styles.button} onPress={() => logout()}>
                        <Ionicons name="log-out-outline" size={20} color={CommonColors.black} />
                        <Text style={styles.buttonText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
};

const styles = MeStyle;

export default MeScreen;
