import { CommonColors } from "@/src/common/resource/colors";
import { useToast } from "@/src/customize/toast.context";
import { ShopModel } from "@/src/data/model/shop.model";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as ShopManagement from "@/src/data/management/shop.management";
import ShopHeaderComponent from "./comp/shop-header/shop-header.component";
import { AppConfig } from "@/src/common/config/app.config";
import TabShopComponent from "./comp/tab-shop/tab-shop.component";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import TabProductComponent from "./comp/tab-product/tab-product.component";
import TabCategoryComponent from "./comp/tab-category/tab-category.component";

type Props = {}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const routes = [
    { key: 'shop', title: 'Cửa hàng' },
    { key: 'product', title: 'Sản phẩm' },
    { key: 'category', title: 'Danh mục' }
];

const ShopScreen = (props: Props) => {
    const { shop_id: SHOP_ID } = useRoute().params as {
        shop_id: number
    }
    const { showToast } = useToast();
    const [index, setIndex] = useState(0);
    const [preImage, setPreImage] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [shop, setShop] = useState<ShopModel | null>(null);

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchShopById = async () => {
        try {
            const response = await ShopManagement.fetchShopById(+SHOP_ID);
            if (response) {
                setShop(response);
            }
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau");
        }
    }



    useEffect(() => {
        fetchPreImage();
        if (SHOP_ID) {
            fetchShopById();
        }
    }, [])

    return (
        <>
            {/* Header */}
            <View style={[styles.headerContainer]}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.searchContainer}>
                    <Octicons name="search" size={18} color={CommonColors.white} />
                    <TextInput
                        value={searchInput}
                        onChangeText={(text: string) => setSearchInput(text)}
                        placeholder="Tìm kiếm sản phẩm trong cửa hàng"
                    />
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ position: 'absolute' }}>
                    <ShopHeaderComponent shop={shop} preImage={preImage} />
                </View>
                <View style={styles.shopContentView}>
                    <TabView
                        navigationState={{ index, routes }}
                        renderScene={SceneMap({
                            shop: () => (<TabShopComponent shop={shop} shop_id={SHOP_ID} preImage={preImage} />),
                            product: TabProductComponent,
                            category: TabCategoryComponent
                        })}
                        onIndexChange={setIndex}
                        initialLayout={{ width: WIDTH_SCREEN }}
                        renderTabBar={props => (
                            <TabBar
                                {...props}
                                indicatorStyle={{ backgroundColor: CommonColors.primary }} // thanh gạch dưới tab active
                                style={{ backgroundColor: 'white' }}
                                renderTabBarItem={({ route, labelStyle }) => {
                                    const active = routes[index].key === route.key;
                                    return (
                                        <TouchableOpacity
                                            style={{
                                                width: WIDTH_SCREEN * (1 / 3),
                                                alignItems: 'center',
                                                paddingVertical: 12,
                                            }}
                                            onPress={() => {
                                                /** Tìm index của route để chuyển tab */
                                                const routeIndex = routes.findIndex(r => r.key === route.key);
                                                setIndex(routeIndex);
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    labelStyle,
                                                    {
                                                        color: active ? CommonColors.primary : CommonColors.gray,
                                                        fontSize: 14,
                                                        fontWeight: '500',
                                                        textAlign: 'center',
                                                    },
                                                ]}
                                            >
                                                {route.title}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }}

                            />
                        )}
                    />
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    /** Header */
    headerContainer: {
        width: WIDTH_SCREEN,
        height: 100,
        backgroundColor: 'transparent',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingTop: 20,
        position: 'absolute',
        zIndex: 10000000000
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 15,
    },
    searchContainer: {
        width: WIDTH_SCREEN * 0.8,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: 5,
        gap: 10,
        marginLeft: 18
    },
    /** Shop */
    shopContentView: {
        flex: 1,
        backgroundColor: CommonColors.white,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        marginTop: 190,
        overflow: 'hidden'
    }
})

export default ShopScreen;