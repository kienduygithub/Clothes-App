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

type Props = {}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const ShopScreen = (props: Props) => {
    const { shop_id: SHOP_ID } = useRoute().params as {
        shop_id: number
    }
    const { showToast } = useToast();
    const [searchInput, setSearchInput] = useState('');
    const [shop, setShop] = useState<ShopModel | null>(null);
    const [preImage, setPreImage] = useState('');

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchShopById = async () => {
        try {
            const response = await ShopManagement.fetchShopById(+SHOP_ID);
            console.log(response);
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
            <View>
                <ShopHeaderComponent shop={shop} preImage={preImage} />
                <Text>Shop Screen</Text>
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
})

export default ShopScreen;