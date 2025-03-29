import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native"
import ProductDetailStyle from "./product-details.style"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import ImageSliderComponent from "@/src/components/imageSlider/image-slider.comp"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { CommonColors } from "@/src/common/resource/colors"
import { useHeaderHeight } from "@react-navigation/elements";
import Animated, { FadeInDown } from "react-native-reanimated"
import { ProductImageModel, ProductModel } from "@/src/data/model/product.model";
import * as ProductManagement from "../../data/management/product.management";
import { AppConfig } from "@/src/common/config/app.config"
import RenderHTML from "react-native-render-html";

type Props = {}

const ProductDetailScreen = (props: Props) => {
    const { id, productType } = useLocalSearchParams();
    const [preImage, setPreImage] = useState('');
    const [widthWindow, setWidthWindow] = useState(0);
    const [product, setProduct] = useState<ProductModel>();
    const [slideImages, setSlideImages] = useState<string[]>([]);

    useEffect(() => {
        fetchPreImage();
        fetchWidthWindow();
        fetchProductDetails();
    }, []);

    const fetchPreImage = () => {
        const preImage = new AppConfig().getPreImage();
        setPreImage(preImage);
    }

    const fetchWidthWindow = () => {
        const { width } = Dimensions.get('window');
        setWidthWindow(width);
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

    const headerHeight = useHeaderHeight();
    return (
        <>
            <Stack.Screen options={{
                title: "Chi tiết sản phẩm",
                headerShown: true,
                headerTransparent: true,
                headerTitleAlign: "center",
                headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <FontAwesome name="arrow-circle-o-left" size={26} color={CommonColors.primary} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="cart-outline" size={28} color={CommonColors.primary} style={{ opacity: 0.6 }} />
                    </TouchableOpacity>
                )
            }} />
            <ScrollView style={{ marginTop: headerHeight, marginBottom: 90 }} showsVerticalScrollIndicator={false}>
                {product && (
                    <Animated.View entering={FadeInDown.delay(300).duration(500)}>
                        <ImageSliderComponent images={slideImages} preImage={preImage} />
                    </Animated.View>
                )}
                {product && (
                    <View style={styles.container}>
                        <Animated.View style={styles.ratingWrapper} entering={FadeInDown.delay(500).duration(500)}>
                            <View style={styles.ratingWrapper}>
                                <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                                <Text style={styles.rating}>
                                    4.8
                                    <Text>(138)</Text>
                                </Text>
                            </View>
                            <TouchableOpacity>
                                <FontAwesome name="heart-o" size={20} color={CommonColors.yellow} />
                            </TouchableOpacity>
                        </Animated.View>

                        <Animated.Text
                            style={styles.title}
                            entering={FadeInDown.delay(700).duration(500)}
                        >
                            {product.product_name}
                        </Animated.Text>

                        <Animated.View style={styles.priceWrapper} entering={FadeInDown.delay(900).duration(500)}>
                            <Text style={styles.price}>đ{product.unit_price}</Text>
                            <View style={styles.priceDiscount}>
                                <Text style={styles.priceDiscountTxt}>0% Off</Text>
                            </View>
                        </Animated.View>

                        <Animated.View
                            style={styles.description}
                            entering={FadeInDown.delay(1100).duration(500)}
                        >
                            <RenderHTML contentWidth={widthWindow} source={{ html: product.description }} />
                        </Animated.View>

                        <Animated.View style={styles.productVariantWrapper} entering={FadeInDown.delay(1300).duration(500)}>
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
                        </Animated.View>
                    </View>
                )}
            </ScrollView>
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