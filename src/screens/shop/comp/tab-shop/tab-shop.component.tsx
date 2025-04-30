import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CommonColors } from "@/src/common/resource/colors";
import { CouponModel } from "@/src/data/model/coupon.model";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/src/customize/toast.context";
import * as CouponManagement from "@/src/data/management/coupon.management";
import * as ShopManagement from "@/src/data/management/shop.management";
import CouponItemComponent from "../coupon-item/coupon-item.component";
import { ShopModel } from "@/src/data/model/shop.model";
import { ProductModel } from "@/src/data/model/product.model";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import ProductItemComponent from "@/src/screens/home/comp/product-item/product-item.comp";
import { PaginateModel } from "@/src/common/model/paginate.model";
import { router } from "expo-router";

type Props = {
    shop: ShopModel | null;
    shop_id: number;
    preImage: string;
}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const TabShopComponent = ({
    shop,
    shop_id,
    preImage = ''
}: Props) => {
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState<CouponModel[]>([]);
    const [latestProducts, setLatestProducts] = useState<ProductModel[]>([]);
    const [popularProducts, setPopularProducts] = useState<ProductModel[]>([]);
    const [paginatePopular, setPaginatePopular] = useState<PaginateModel>(
        new PaginateModel().convertObj({
            currentPage: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 1
        })
    )
    const [paginateLatest, setPaginateLatest] = useState<PaginateModel>(
        new PaginateModel().convertObj({
            currentPage: 1,
            limit: 10,
            totalItems: 0,
            totalPages: 1
        })
    )
    const [isEndReachedPopular, setIsEndReachedPopular] = useState(false);
    const [isEndReachedLatest, setIsEndReachedLatest] = useState(false);
    const isFetchingPopular = useRef(false);
    const isFetchingLatest = useRef(false);

    const fetchCoupons = async () => {
        try {
            const response = await CouponManagement.fetchCouponShopMobile(shop_id);
            console.log(response);
            if (response) {
                setCoupons(response);
            }
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
        }
    }

    const handleSaveCoupon = async (coupon_id: number) => {
        try {
            await CouponManagement.saveCouponMobile(coupon_id);
            setCoupons((prevCoupons) =>
                prevCoupons.map((coupon) =>
                    coupon.id === coupon_id
                        ? { ...coupon, is_saved: true, is_used: false } as CouponModel
                        : coupon
                )
            );
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
        }
    }

    const fetchPopularProducts = async (page: number) => {
        try {
            isFetchingPopular.current = true;
            const response = await ShopManagement.fetchPopularProductsByShop(
                shop_id,
                page,
                paginatePopular.limit
            );
            let products = response.products;
            let paginate = response.paginate;
            setPopularProducts(prev => [...prev, ...products]);
            setPaginatePopular(prev => ({
                ...prev,
                totalItems: paginate.totalItems,
                totalPages: paginate.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= paginate.totalPages) {
                setIsEndReachedPopular(true);
            }
            isFetchingPopular.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetchingPopular.current = false;
        }
    }

    const fetchLatestProducts = async (page: number) => {
        try {
            isFetchingLatest.current = false;
            const response = await ShopManagement.fetchLatestProductsByShop(
                shop_id,
                page,
                paginateLatest.limit
            );
            let products = response.products;
            let paginate = response.paginate;
            setLatestProducts(prev => [...prev, ...products]);
            setPaginateLatest(prev => ({
                ...prev,
                totalItems: paginate.totalItems,
                totalPages: paginate.totalPages,
                currentPage: page
            } as PaginateModel));

            if (page >= response.paginate.totalPages) {
                setIsEndReachedLatest(true);
            }
            isFetchingPopular.current = false;
        } catch (error) {
            console.log(error);
            showToast("Oops! Hệ thống đang bận, quay lại sau", "error");
            isFetchingPopular.current = false;
        }
    }

    useEffect(() => {
        if (shop_id) {
            fetchCoupons();
            fetchPopularProducts(1); /** Tải trang đầu tiên */
            fetchLatestProducts(1); /** Tải trang đầu tiên */
        }
    }, [])

    const navigateToSearchShopScreen = (TYPE: "BestSellers" | "Latest") => {
        router.navigate({
            pathname: '/(routes)/shop-search',
            params: {
                shop_id: shop_id,
                type: TYPE,
                textTitle: TYPE === "BestSellers"
                    ? 'Sản phẩm bán chạy'
                    : 'Sản phẩm ra mắt gần đây'
            }
        })
    }


    return (
        <ScrollView style={styles.container}>
            {coupons.length > 0 && (
                <ScrollView
                    style={{ marginBottom: 10 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                >
                    {coupons.map((coupon, index) => (
                        <CouponItemComponent
                            key={`${index}-${coupon.id}`}
                            item={coupon}
                            preImage={preImage}
                            onSaveCoupon={(coupon_id) => handleSaveCoupon(coupon_id)}
                        />
                    ))}
                </ScrollView>
            )}
            {/* Mô tả cửa hàng */}
            <View style={styles.section}>
                <View style={styles.shopContainer}>
                    <View style={styles.shopInfo}>
                        <Image style={styles.imageLogo} source={{ uri: `${preImage}/${shop?.logo_url}` }} />
                        <View style={styles.nameAndAddressContainer}>
                            <Text style={styles.name}>{shop?.shop_name}</Text>
                            <Text style={styles.address}>{shop?.contact_address}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Mô tả cửa hàng</Text>
                    <Text style={{ fontSize: 13, letterSpacing: 1.1 }}>{shop?.description ?? ''}</Text>
                    <Text style={{ fontSize: 13, letterSpacing: 1.1 }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Accusamus veritatis est dicta ut molestias cupiditate voluptatibus eum amet, unde voluptatum ea quidem harum cum sit et non. Est, amet reiciendis?</Text>
                </View>
            </View>
            {/* Sản phẩm bán chạy */}
            <View style={[styles.section, { paddingHorizontal: 0 }]}>
                <View style={{ paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <FontAwesome5 name="cubes" size={16} color={CommonColors.black} />
                    <Text style={[styles.sectionHeaderText]}>
                        Sản phẩm bán chạy
                    </Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator
                    style={{ paddingLeft: 16 }}
                    scrollEventThrottle={16}
                >
                    {popularProducts.map((product, index) => (
                        <View key={`${index}-${product.id}`} style={{ marginRight: 15 }}>
                            <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => navigateToSearchShopScreen("BestSellers")} style={styles.btnSearchMore} >
                        <AntDesign name="rightcircleo" size={32} color={CommonColors.primary} />
                        <Text style={styles.btnSearchMoreText}>Tìm hiểu thêm</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            {/* Sản phẩm mới ra */}
            <View style={[styles.section, { paddingHorizontal: 0 }]}>
                <View style={{ paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <FontAwesome5 name="cubes" size={16} color={CommonColors.black} />
                    <Text style={[styles.sectionHeaderText]}>
                        Sản phẩm gần đây
                    </Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator
                    style={{ paddingLeft: 16 }}
                >
                    {latestProducts.map((product, index) => (
                        <View key={`${index}-${index}-${product.id}`} style={{ marginRight: 15 }}>
                            <ProductItemComponent item={product} index={index} preImage={preImage} productType="regular" />
                        </View>
                    ))}
                    <TouchableOpacity onPress={() => navigateToSearchShopScreen("Latest")} style={styles.btnSearchMore}>
                        <AntDesign name="rightcircleo" size={32} color={CommonColors.primary} />
                        <Text style={styles.btnSearchMoreText}>Tìm hiểu thêm</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: CommonColors.extraLightGray
    },
    section: {
        width: WIDTH_SCREEN,
        backgroundColor: CommonColors.white,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: 10
    },
    sectionHeaderText: {
        fontSize: 16,
        fontWeight: '500',
    },
    shopContainer: {
        width: WIDTH_SCREEN,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10
    },
    imageLogo: {
        width: 70,
        height: 70,
        borderRadius: 40,
        marginRight: 10
    },
    nameAndAddressContainer: {
        height: 70,
    },
    name: {
        marginTop: 10,
        marginBottom: 5,
        fontSize: 18,
        fontWeight: '700',
        color: CommonColors.black,
        letterSpacing: 1.8
    },
    address: {
        fontSize: 13,
        color: CommonColors.black,
        letterSpacing: 1.2
    },
    btnSearchMore: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        width: (WIDTH_SCREEN - 40) / 2 - 10
    },
    btnSearchMoreText: {
        fontSize: 16,
        color: CommonColors.primary
    }
})

export default TabShopComponent;