import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import ProductDetailStyle from "./product-details.style"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import ImageSliderComponent from "@/src/components/imageSlider/image-slider.comp"
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons"
import { CommonColors } from "@/src/common/resource/colors"
import Animated, { FadeInDown } from "react-native-reanimated"
import { ProductImageModel, ProductModel } from "@/src/data/model/product.model";
import * as ProductManagement from "../../data/management/product.management";
import { AppConfig } from "@/src/common/config/app.config"
import RenderHTML from "react-native-render-html";
import { ProductVariantModel } from "@/src/data/model/product_variant.model"
import AvailableVariantImagesComponent from "./comp/available-variant-images/available-variant-images.component"
import ShopProductListComponent from "./comp/shop-product-list/shop-product-list.component"
import SelectVariantComponent from "@/src/components/select-variant/select-variant.component"

type Props = {};

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const [cartPosition, setCartPosition] = useState({ x: width - 50, y: 50 });
    const [preImage, setPreImage] = useState('');
    const [product, setProduct] = useState<ProductModel>();
    const [slideImages, setSlideImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<ProductVariantModel[]>([]);
    const [availableVariants, setAvailableVariants] = useState<Map<number, string>>();
    const [products, setProducts] = useState<ProductModel[]>([]);

    useEffect(() => {
        fetchPreImage();
        fetchProductVariants();
        fetchProductDetails();
    }, []);

    useEffect(() => {
        if (product) {
            fetchProductShop();
        }
    }, [product])

    const fetchPreImage = () => {
        const preImage = new AppConfig().getPreImage();
        setPreImage(preImage);
    }

    const fetchProductVariants = async () => {
        try {
            const response = await ProductManagement.fetchProductVariantByProductId(+id);
            console.log('Danh sách biến thể: Done!');
            const availableVariantMap = new Map<number, string>(
                response.map((variant: ProductVariantModel) => [variant.color?.id ?? 0, variant.image_url])
            );
            availableVariantMap.delete(0);
            setAvailableVariants(availableVariantMap);
            setVariants(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProductDetails = async () => {
        try {
            const response = await ProductManagement.fetchDetailProduct(+id);
            console.log('Chi tiết sản phẩm: Done!');
            const images = response?.product_images?.map(
                (image: ProductImageModel) => image.image_url
            )
            setSlideImages(images);
            setProduct(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchProductShop = async () => {
        try {
            const response = await ProductManagement.fetchProductsByShopId(product?.shop?.id ?? 0);
            console.log('Danh sách sản phẩm cửa hàng: Done!');
            setProducts(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Stack.Screen options={{
                title: "",
                headerShown: true,
                headerTransparent: true,
                headerLeft: () => (
                    <TouchableOpacity style={styles.buttonHeader} onPress={() => router.back()}>
                        <AntDesign name="arrowleft" size={28} color={CommonColors.white} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.buttonHeader}
                        onPress={() => router.back()}
                        onLayout={(event) => {
                            const { x, y } = event.nativeEvent.layout;
                            setCartPosition({ x, y });
                        }}
                    >
                        <Ionicons name="cart-outline" size={28} color={CommonColors.white} />
                    </TouchableOpacity>
                )
            }} />
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 90 }}>
                {/* Product Slider */}
                {product && (
                    <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                        <ImageSliderComponent images={slideImages} preImage={preImage} />
                    </Animated.View>
                )}
                {/* Product Info */}
                {product && (
                    <Animated.View style={styles.container} entering={FadeInDown.delay(600).duration(500)}>
                        <Animated.View
                            style={styles.variantWrapper}
                            entering={FadeInDown.delay(800).duration(500)}
                        >
                            <View style={styles.variantInfoWrapper}>
                                <Text style={styles.variantText}>{availableVariants?.size} phân loại có sẵn</Text>
                                <AvailableVariantImagesComponent images={Array.from(availableVariants?.values() ?? [])} preImage={preImage} />
                            </View>
                        </Animated.View>

                        <Animated.View style={styles.metaInfoWrapper} entering={FadeInDown.delay(800).duration(500)}>
                            <View style={styles.priceAndRatingWrapper}>
                                <View style={styles.priceWrapper}>
                                    <Text style={styles.price}>đ{product.unit_price}</Text>
                                </View>
                                <View style={styles.ratingWrapper}>
                                    <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                                    <Text style={styles.rating}>
                                        {Number(product.rating).toFixed(1)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.soldAndLikeWrapper}>
                                <Text style={styles.soldTxt}>Đã bán {product.sold_quantity}</Text>
                                <TouchableOpacity>
                                    <FontAwesome name="heart-o" size={20} color={CommonColors.lightGray} />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>

                        <Animated.Text style={styles.title} entering={FadeInDown.delay(800).duration(500)} >
                            {product.product_name}
                        </Animated.Text>

                        <Animated.View
                            style={styles.descriptionWrapper}
                            entering={FadeInDown.delay(800).duration(500)}
                        >
                            {/* <View style={styles.devider}></View> */}
                            <View style={styles.descHeader}>
                                <Text style={styles.descTxt}>Chi tiết sản phẩm</Text>

                            </View>
                            {/* <View style={styles.devider}></View> */}
                            <View style={{ paddingHorizontal: 20, flex: 1 }}>
                                <RenderHTML contentWidth={Dimensions.get('window').width} source={{ html: product.description }} />
                            </View>
                        </Animated.View>

                        {/* <Animated.View style={styles.productVariantWrapper} entering={FadeInDown.delay(1300).duration(500)}>
                            <View style={styles.productVariantType}>
                                <Text style={styles.productVariantTitle}>Color</Text>

                                <View style={styles.productVariantValueWrapper}>
                                    <View style={styles.productSeletedVariantColor}>
                                        <View style={[styles.productVariantColorValue, { backgroundColor: CommonColors.yellow }]}></View>
                                    </View>
                                    <View style={[styles.productVariantColorValue, { backgroundColor: CommonColors.gray }]}></View>
                                    <View style={[styles.productVariantColorValue, { backgroundColor: CommonColors.green }]}></View>
                                    <View style={[styles.productVariantColorValue, { backgroundColor: CommonColors.primary }]}></View>
                                    <View style={[styles.productVariantColorValue, { backgroundColor: CommonColors.red }]}></View>
                                    <View style={[styles.productVariantColorValue, { backgroundColor: CommonColors.purple }]}></View>
                                </View>
                            </View>
                            <View style={styles.productVariantType}>
                                <Text style={styles.productVariantTitle}>Size</Text>

                                <View style={styles.productVariantValueWrapper}>
                                    <View style={[styles.productVariantSizeValue, styles.productSeletedVariantSize]}>
                                        <Text style={[styles.productVariantSizeValueTxt, styles.productSeletedVariantSizeTxt]}>S</Text>
                                    </View>
                                    <View style={[styles.productVariantSizeValue]}>
                                        <Text style={[styles.productVariantSizeValueTxt]}>M</Text>
                                    </View>
                                    <View style={[styles.productVariantSizeValue]}>
                                        <Text style={[styles.productVariantSizeValueTxt]}>L</Text>
                                    </View>
                                    <View style={[styles.productVariantSizeValue]}>
                                        <Text style={[styles.productVariantSizeValueTxt]}>XL</Text>
                                    </View>
                                    <View style={[styles.productVariantSizeValue]}>
                                        <Text style={[styles.productVariantSizeValueTxt]}>XXL</Text>
                                    </View>
                                </View>
                            </View>
                        </Animated.View> */}
                    </Animated.View>
                )}
                {/* Variants */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                        <SelectVariantComponent
                            product={product}
                            variants={variants}
                            preImage={preImage}
                            cartPosition={cartPosition}
                        />
                    </Animated.View>
                )}
                {/* Shop */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                        <View style={styles.shopWrapper}>
                            <View style={styles.shopInfoWrapper}>
                                <View style={{ width: 60, height: 60 }}>
                                    <Image
                                        style={{ width: '100%', height: '100%' }}
                                        source={{ uri: `${preImage}/${product.shop?.logo_url}` }}
                                    />
                                </View>
                                <View style={styles.shopContent}>
                                    <Text style={styles.shopNameText}>{product.shop?.shop_name}</Text>
                                    <Text style={styles.shopAddressText}>{product.shop?.contact_address}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.buttonShopView}>
                                <Text style={styles.buttonShopViewText}>Xem cửa hàng</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
                {/* Product Shop */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                        <View style={styles.productShopWrapper}>
                            <Text style={styles.productShopText}>Các sản phẩm khác của cửa hàng</Text>
                            <ShopProductListComponent
                                products={products}
                                preImage={preImage}
                                shop_id={product.shop?.id ?? 0}
                            />
                        </View>
                    </Animated.View>
                )}
                {/* Review */}
                {product && (
                    <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>

                    </Animated.View>
                )}
            </ScrollView>
            {/* Button Action */}
            <Animated.View
                style={styles.buttonWrapper}
                entering={FadeInDown.delay(500).duration(500).springify()}
            >
                <TouchableOpacity style={[
                    styles.button,
                    {
                        backgroundColor: CommonColors.white,
                        borderColor: CommonColors.primary,
                        borderWidth: 1,
                    }
                ]}>
                    <Ionicons name="cart-outline" size={20} color={CommonColors.primary} />
                    <Text style={[styles.buttonTxt, { color: CommonColors.primary }]}>Thêm vào giỏ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonTxt}>Mua ngay</Text>
                </TouchableOpacity>
            </Animated.View>
        </>
    )
}

const styles = ProductDetailStyle;

export default ProductDetailScreen;