import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Animated,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { router, Stack, useFocusEffect } from 'expo-router';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MeStyle from './me.style';
import { AppConfig } from '@/src/common/config/app.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/src/data/types/global';
import * as UserManagement from '@/src/data/management/user.management';
import * as UserActions from '@/src/data/store/actions/user/user.action';
import * as CartActions from '@/src/data/store/actions/cart/cart.action';
import { UserStoreState } from '@/src/data/store/reducers/user/user.reducer';
import { useToast } from '@/src/customize/toast.context';
import { MessageError } from '@/src/common/resource/message-error';

type Props = {};

interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
}

const MeScreen = (props: Props) => {
    const { showToast } = useToast();
    const preImage = new AppConfig().getPreImage();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const dispatch = useDispatch();
    const headerHeight = useHeaderHeight();
    const [fadeAnim] = useState(new Animated.Value(0));

    // Dummy data for recently viewed products (replace with actual data)
    const recentlyViewed: Product[] = [
        {
            id: '1',
            name: 'Casual Blue T-Shirt',
            price: 250000,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab',
        },
        {
            id: '2',
            name: 'Denim Jacket',
            price: 850000,
            image: 'https://images.unsplash.com/photo-1601333145486-5c5a8a3753ab',
        },
        {
            id: '3',
            name: 'Summer Dress',
            price: 450000,
            image: 'https://images.unsplash.com/photo-1591360238940-aee6c04ff07a',
        },
    ];

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchInfoUser();
        }, [])
    );

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
                dispatch(UserActions.UpdateExpiresLogged(false));
                showToast(MessageError.EXPIRES_SESSION, 'error');
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    };

    const navigateToInfoDetailScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        router.navigate('/(routes)/info-detail');
    };

    const logout = async () => {
        try {
            await new AppConfig().clear();
            dispatch(UserActions.ResetInfoLogged());
            dispatch(CartActions.ResetCart());
            router.dismissAll();
            router.navigate({
                pathname: '/(routes)/sign-in',
            });
        } catch (error) {
            console.log(error);
        }
    };

    const navigateFavoriteScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        router.navigate('/(routes)/favorite');
    };

    const navigateOrderManageScreen = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        router.navigate('/(routes)/order-manage');
    };

    const navigateRegisterShop = () => {
        if (userSelector.isLogged === false) {
            showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
            return;
        }
        // router.navigate('/(routes)/register-shop');
    };

    const navigateToProductDetail = (productId: string) => {
        router.navigate({
            pathname: '/(routes)/product-details',
            params: { id: productId }
        });
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Hồ sơ',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
            <View style={[styles.container, { marginTop: headerHeight }]}>
                <LinearGradient
                    colors={['#33adff', '#3b82f6']}
                    style={styles.header}
                >
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <View style={styles.headerContent}>
                            <View style={styles.userInfo}>
                                {userSelector.image_url === '' ? (
                                    <Image
                                        source={{
                                            uri: 'https://tiki.vn/blog/wp-content/uploads/2023/01/Y7deW5ZtpOonbiD_XawHLHdkjKYKHvWxvxNZzKdXXn0L8InieLIH_-U5m0u-RUlFtXKp0Ty91Itj4Oxwn_tjKg_UZo3lxFSrOH_DHIbpKP1LDn80z6BbOxj4d8bmymdy8PWFGjLkTpCdoz-3X-KY7IedQ_dxWJlHSIBWwCYhgM02FvUfVUgLKOQxrQWgjw.jpg',
                                        }}
                                        style={styles.infoImage}
                                    />
                                ) : (
                                    <Image
                                        source={{ uri: `${preImage}/${userSelector.image_url}` }}
                                        style={styles.infoImage}
                                    />
                                )}
                                <View>
                                    <Text style={styles.username}>
                                        {userSelector.name === '' ? 'Anonymous' : userSelector.name}
                                    </Text>
                                    <Text style={styles.tagline}>Cảm hứng bất tận</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.registerShopButton}
                                onPress={navigateRegisterShop}
                            >
                                <Text style={styles.registerShopText}>Đăng ký cửa hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </LinearGradient>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateOrderManageScreen}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="person-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Danh sách đơn hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateFavoriteScreen}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="heart-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Danh sách mong muốn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => router.navigate('/(routes)/address')}
                            activeOpacity={0.7}
                        >
                            <FontAwesome name="address-card-o" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Địa chỉ giao hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                            <Ionicons name="card-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Lịch sử thanh toán</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} activeOpacity={0.7}>
                            <Ionicons name="help-circle-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Chăm sóc khách hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateToInfoDetailScreen}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="pencil-outline" size={20} color="#33adff" />
                            <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
                        </TouchableOpacity>
                        {userSelector.isLogged && userSelector.expires ? (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={logout}
                                activeOpacity={0.7}
                            >
                                <AntDesign name="logout" size={20} color="#33adff" />
                                <Text style={styles.buttonText}>Đăng xuất</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => router.navigate('/(routes)/sign-in')}
                                activeOpacity={0.7}
                            >
                                <AntDesign name="login" size={20} color="#33adff" />
                                <Text style={styles.buttonText}>Đăng nhập</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.recentlyViewedSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Sản phẩm đã xem gần đây</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllText}>Xem tất cả</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productCarousel}>
                            {recentlyViewed.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.productCard}
                                    onPress={() => navigateToProductDetail(product.id)}
                                    activeOpacity={0.7}
                                >
                                    <Image source={{ uri: product.image }} style={styles.productImage} />
                                    <Text style={styles.productName} numberOfLines={2}>
                                        {product.name}
                                    </Text>
                                    <Text style={styles.productPrice}>
                                        {product.price.toLocaleString('vi-VN')} ₫
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = MeStyle;

export default MeScreen;