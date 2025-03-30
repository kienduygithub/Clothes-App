import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import ProductDetailStyle from "./product-details.style"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
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
import { useWindowDimensions } from 'react-native';
import { WebView } from "react-native-webview";
import { ColorType, SizeType } from "@/src/data/types/global"

type Props = {}

const ProductDetailScreen = (props: Props) => {
    const { id, shop_id, productType } = useLocalSearchParams();
    const [preImage, setPreImage] = useState('');
    const [widthWindow, setWidthWindow] = useState(useWindowDimensions().width);
    const [product, setProduct] = useState<ProductModel>();
    const [slideImages, setSlideImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<ProductVariantModel[]>([]);
    const [availableVariants, setAvailableVariants] = useState<Map<number, string>>();
    const [products, setProducts] = useState<ProductModel[]>([]);

    const [colors, setColors] = useState<ColorType[]>([]);
    const [sizes, setSizes] = useState<SizeType[]>([]);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<number | null>(null);
    const [stockQuantity, setStockQuantity] = useState<number>(0);
    const [displayVariantImage, setDisplayVariantImage] = useState('');

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
            const colors: ColorType[] = Array.from(new Set(response.map(variant => variant.color?.id)))
                .map(colorId => {
                    const variant = response.find(v => v.color?.id === colorId);
                    return {
                        id: variant?.color?.id ?? 0,
                        color_name: variant?.color?.color_name ?? '',
                        image_url: variant?.image_url ?? ''
                    }
                })
                .filter(color => color.id !== 0);
            const sizes: SizeType[] = Array.from(new Set(response.map(v => v.size?.id)))
                .map(sizeId => {
                    const variant = response.find(v => v.size?.id === sizeId);
                    return {
                        id: variant?.size?.id ?? 0,
                        size_code: variant?.size?.size_code ?? ''
                    }
                })
                .filter(size => size.id !== 0);
            setColors(colors);
            setSizes(sizes);
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

    useEffect(() => {
        if (!selectedColor && !selectedSize || !selectedColor && selectedSize) {
            const total = variants.reduce(
                (stock: number, variant: ProductVariantModel) => {
                    return stock + variant.stock_quantity;
                }, 0
            );
            setStockQuantity(total);
        } else if (selectedColor && !selectedSize) {
            const total = variants.filter(v => v.color?.id === selectedColor)
                .reduce(
                    (stock: number, variant: ProductVariantModel) => {
                        return stock + variant.stock_quantity
                    }, 0
                );
            setStockQuantity(total);
        } else if (selectedColor && selectedSize) {
            const total = variants.find(
                v => v.color?.id === selectedColor && v.size?.id === selectedSize
            )?.stock_quantity ?? 0;
            setStockQuantity(total);
        }
    }, [selectedColor, selectedSize, variants])

    const handleSelectSize = (id: number) => {
        setSelectedSize((prev) => (prev === id ? null : id));
    }

    const handleSelectColor = (id: number) => {
        setSelectedColor((prev) => (prev === id ? null : id));
    }

    const getDisplayVariantImage = () => {
        if (selectedColor) {
            const seletedVariant = variants.find(v => v.color?.id === selectedColor);
            return seletedVariant?.image_url || product?.product_images[0].image_url;
        }

        return product?.product_images[0].image_url;
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
                    <TouchableOpacity style={styles.buttonHeader} onPress={() => router.back()}>
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
                        <View style={styles.selectVariantWrapper}>
                            <View style={styles.selectVariantInfoWrapper}>
                                <View style={styles.selectVariantImageWrapper}>
                                    <Image style={styles.selectVariantImage} source={{ uri: `${preImage}/${getDisplayVariantImage()}` }} />
                                </View>
                                <View style={styles.unitPriceAndStockWrapper}>
                                    <View style={styles.unitPriceWrapper}>
                                        <Text style={styles.dText}>đ</Text>
                                        <Text style={styles.unitPriceText}>{product.unit_price}</Text>
                                    </View>
                                    <Text style={styles.stockText}>
                                        Hàng tồn: {stockQuantity}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.devider}></View>
                            <View style={styles.productVariantWrapper}>
                                <View style={styles.productVariantTypeWrapper}>
                                    <Text style={styles.productVariantTitle}>Phân loại màu</Text>
                                    <View style={styles.productVariantValueWrapper}>
                                        {colors.map((color) => (
                                            <TouchableOpacity
                                                key={`color-${color.id}`}
                                                style={[styles.productVariantValue, selectedColor === color.id && styles.selectedVariant]}
                                                onPress={() => handleSelectColor(color.id)}
                                            >
                                                <Image
                                                    style={styles.productVariantImage}
                                                    source={{ uri: `${preImage}/${color.image_url}` }}
                                                />
                                                <Text style={[selectedColor === color.id && styles.selectedVariantText]}>
                                                    {color.color_name}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.devider}></View>
                            <View style={styles.productVariantWrapper}>
                                <View style={styles.productVariantTypeWrapper}>
                                    <Text style={styles.productVariantTitle}>Phân loại kích cỡ</Text>
                                    <View style={styles.productVariantValueWrapper}>
                                        {sizes.map((size) => (
                                            <TouchableOpacity
                                                key={`size-${size.size_code}`}
                                                style={[styles.productVariantValue, selectedSize === size.id && styles.selectedVariant]}
                                                onPress={() => handleSelectSize(size.id)}
                                            >
                                                <Text style={[selectedSize === size.id && styles.selectedVariantText]}>Size {size.size_code}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            </View>
                            <View style={styles.devider}></View>
                            <View style={styles.quantityWrapper}>
                                <View style={styles.quantityButton}>
                                    <AntDesign name="minus" size={24} color="black" />
                                </View>
                                <TextInput

                                />
                                <View style={styles.quantityButton}>
                                    <AntDesign name="plus" size={24} color="black" />
                                </View>
                            </View>
                        </View>
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