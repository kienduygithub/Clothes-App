import { CommonColors } from "@/src/common/resource/colors"
import { ProductModel } from "@/src/data/model/product.model";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as ProductManagement from "@/src/data/management/product.management";
import { useToast } from "@/src/customize/toast.context";
import ProductListComponent from "@/src/screens/home/comp/product-list/product-list.comp";
import ProductItemComponent from "@/src/screens/home/comp/product-item/product-item.comp";

type Props = {
    shop_id: number;
    preImage: string;
}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const TabProductComponent = ({
    shop_id,
    preImage = ''
}: Props) => {
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState(0);
    const [decreasePrice, setDecreasePrice] = useState(true);
    const [popularProducts, setPopularProducts] = useState<ProductModel[]>([]);
    const [latestProducts, setLatestProducts] = useState<ProductModel[]>([]);
    const [productByPrices, setProductByPrices] = useState<ProductModel[]>([]);
    const isFetching = useRef(false);

    const changeActiveTab = (value: number) => {
        if (value === 2) {
            setActiveTab(2);
            setDecreasePrice(prev => !prev);
            return;
        }
        setActiveTab(value);
        if (decreasePrice) {
            setDecreasePrice(false);
        }
    }

    const fetchPopularProducts = async () => {
        try {
            const response = await ProductManagement.fetchProductsByShopId(shop_id);
            setPopularProducts(response);
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
        }
    }

    const fetchLatestProducts = async () => {
        try {
            const response = await ProductManagement.fetchProductsByShopId(shop_id);
            setLatestProducts(response);
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
        }
    }

    const fetchProductByPrices = async () => {
        try {
            isFetching.current = true;
            const response = await ProductManagement.fetchProductsByShopId(shop_id);
            setProductByPrices(response);
            isFetching.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetching.current = false;
        }
    }

    useEffect(() => {
        if (shop_id) {
            fetchPopularProducts();
        }
    }, []);

    useEffect(() => {
        if (shop_id) {
            if (activeTab === 0) {
                setProductByPrices([]);
                setLatestProducts([])
                fetchPopularProducts();
            } else if (activeTab === 1) {
                setPopularProducts([]);
                setProductByPrices([]);
                fetchLatestProducts();
            } else if (activeTab === 2) {
                setPopularProducts([]);
                setLatestProducts([]);
                fetchProductByPrices();
            }
        }
    }, [activeTab])

    useEffect(() => {
        if (activeTab === 2 && !isFetching.current) {
            fetchProductByPrices();
        }
    }, [decreasePrice]);

    return (
        <>
            <View style={styles.tabBarContainer}>
                <TouchableOpacity style={styles.tabBar} onPress={() => changeActiveTab(0)}>
                    <Text style={[styles.tabBarText, activeTab === 0 && styles.tabBarActiveText]}>
                        Bán chạy
                    </Text>
                </TouchableOpacity>
                <Text style={styles.deviderTabBar}>|</Text>
                <TouchableOpacity style={styles.tabBar} onPress={() => changeActiveTab(1)}>
                    <Text style={[styles.tabBarText, activeTab === 1 && styles.tabBarActiveText]}>
                        Mới nhất
                    </Text>
                </TouchableOpacity>
                <Text style={styles.deviderTabBar}>|</Text>
                <TouchableOpacity style={styles.tabBar} onPress={() => changeActiveTab(2)}>
                    <Text style={[styles.tabBarText, activeTab === 2 && styles.tabBarActiveText]}>
                        Giá
                    </Text>
                    {activeTab === 2 && (
                        <AntDesign name={decreasePrice ? 'arrowdown' : 'arrowup'} size={14} color={CommonColors.primary} />
                    )}
                </TouchableOpacity>
            </View>
            <ScrollView
                style={[styles.container]}
                contentContainerStyle={styles.itemsWrapper}
                showsVerticalScrollIndicator={false}
            >
                {activeTab === 0 && popularProducts.map((product, index) => (
                    <View key={`${index}-${product.id}-${index}`} style={styles.productWrapper}>
                        <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                    </View>
                ))}
                {activeTab === 1 && latestProducts.map((product, index) => (
                    <View key={`${index}-${product.id}-${index}-${index}`} style={styles.productWrapper}>
                        <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                    </View>
                ))}
                {activeTab === 2 && productByPrices.map((product, index) => (
                    <View key={`${index}-${product.id}-${index}-${index}-${index}`} style={styles.productWrapper}>
                        <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                    </View>
                ))}
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,

        shadowColor: '#000',
        elevation: 4,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: 'white',
    },
    tabBar: {
        width: WIDTH_SCREEN * (1 / 3),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5
    },
    tabBarText: {
        color: CommonColors.gray,
        fontSize: 14,
        fontWeight: '500',
    },
    tabBarActiveText: {
        color: CommonColors.primary
    },
    deviderTabBar: {
        color: '#CCC'
    },
    container: {
        backgroundColor: CommonColors.extraLightGray,
        paddingTop: 10,
        paddingHorizontal: 16
    },

    itemsWrapper: {
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'stretch',
        marginBottom: 50
    },
    productWrapper: {
        width: '50%',
        paddingLeft: 5,
        marginBottom: 20
    }
})

export default TabProductComponent;