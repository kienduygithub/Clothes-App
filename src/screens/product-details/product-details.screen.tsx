import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import ProductDetailStyle from "./product-details.style"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useCallback, useEffect, useRef, useState } from "react"
import ImageSliderComponent from "@/src/components/imageSlider/image-slider.comp"
import { AntDesign, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons"
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet"
import { useToast } from "@/src/customize/toast.context"
import * as CartManagement from "../../data/management/cart.management";
import { formatPriceRender } from "@/src/common/utils/currency.helper"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/src/data/types/global"
import { CartStoreState } from "@/src/data/store/reducers/cart/cart.reducer"
import * as CartActions from "@/src/data/store/actions/cart/cart.action";
import { MessageError } from "@/src/common/resource/message-error"
import DialogNotification from "@/src/components/dialog-notification/dialog-notification.component"
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer"
import * as FavoriteManagement from "@/src/data/management/favorite.management";
import * as ReviewManagement from "@/src/data/management/review.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { formatDate } from "@/src/common/utils/time.helper"
import ReviewListComponent from "./comp/review-list/review-list.component"
import { ProductReviewModel } from "@/src/data/model/review.model"
import { PaginateModel } from "@/src/common/model/paginate.model"

type Props = {};

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const { showToast } = useToast();
    const [cartPosition, setCartPosition] = useState({ x: width - 50, y: 50 });
    const [preImage, setPreImage] = useState('');
    const [product, setProduct] = useState<ProductModel>();
    const [slideImages, setSlideImages] = useState<string[]>([]);
    const [variants, setVariants] = useState<ProductVariantModel[]>([]);
    const [availableVariants, setAvailableVariants] = useState<Map<number, string>>();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [reviews, setReviews] = useState<ProductReviewModel[]>([]);
    const [reviewPaginate, setReviewPaginate] = useState<PaginateModel>(new PaginateModel().convertObj({
        currentPage: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1
    }))
    const userSelector = useSelector((state: RootState) => state.userLogged) as UserStoreState;
    const cartSelector = useSelector((state: RootState) => state.cart) as CartStoreState;
    const isFavorite = userSelector.favorites.includes(product?.id ?? 0);
    const dispatch = useDispatch();

    const sheetRef = useRef<BottomSheet>(null);
    const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
    const snapPoints = ["50%"];

    useEffect(() => {
        fetchPreImage();
        fetchProductVariants();
        fetchProductDetails();
    }, []);

    useEffect(() => {
        if (product) {
            fetchProductShop();
            fetchListProductReview();
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
                response?.map((variant: ProductVariantModel) => [variant.color?.id ?? 0, variant.image_url])
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

    const fetchListProductReview = async () => {
        try {
            const response = await ReviewManagement.fetchListReviewProduct(
                product?.shop?.id ?? 0,
                1,
                2
            );
            setReviews(response.get('reviews'));
            setReviewPaginate(response.get('paginate'));
        } catch (error) {
            console.log(error);
        }
    }

    const handleSnapPress = useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
        setIsOpenBottomSheet(true);
    }, [])

    const handleAddToCart = async (variant: ProductVariantModel, quantity: number) => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');

                return;
            }

            const response = await CartManagement.addCartItem(variant, quantity);
            dispatch(CartActions.AddCartItemToCart(
                response.get('cart_item'),
                response.get('cart_shop_id'),
                quantity
            ))
            showToast("Đã thêm sản phẩm vào giỏ hàng", "success");
            sheetRef.current?.close();
        } catch (error: any) {
            console.log(error);
            if (error?.message?.includes("Vượt quá số lượng hàng tồn kho")) {
                showToast(MessageError.EXCEED_QUANTITY_STOCK, "error");
            } else if (error?.message === 'Session expired, please log in again') {
                sheetRef.current?.close();
                router.navigate('/(routes)/sign-in');
                showToast(MessageError.EXPIRES_SESSION, "error");
            } else {
                showToast(MessageError.BUSY_SYSTEM, "error");
                sheetRef.current?.close();
            }

        }
    }

    const navigateToShop = (id: number) => {
        router.navigate({
            pathname: "/(routes)/shop",
            params: {
                shop_id: id
            }
        })
    }

    const navigateToCart = () => {
        router.navigate("/(tabs)/cart");
    }

    const favoriteProduct = async () => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.favoriteProductByUser(product?.id ?? 0);
            dispatch(UserActions.AddFavorite(product?.id ?? 0));
        } catch (error: any) {
            console.log('ProductItemComponent 39: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
        }
    }

    const unFavoriteProduct = async () => {
        try {
            if (userSelector.isLogged === false) {
                showToast(MessageError.NOT_LOGGED_TO_EXECUTE, 'error');
                return;
            }
            await FavoriteManagement.unfavoriteProductByUser(product?.id ?? 0);
            dispatch(UserActions.RemoveFavorite(product?.id ?? 0));
        } catch (error: any) {
            console.log('ProductItemComponent 54: ', error);
            if (error?.message === 'Session expired, please log in again') {
                showToast(MessageError.EXPIRES_SESSION, 'error');
                dispatch(UserActions.UpdateExpiresLogged(false));
            } else {
                showToast(MessageError.BUSY_SYSTEM, 'error');
            }
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
                        onPress={() => navigateToCart()}
                        onLayout={(event) => {
                            const { x, y } = event.nativeEvent.layout;
                            setCartPosition({ x, y });
                        }}
                    >
                        <Ionicons name="cart-outline" size={28} color={CommonColors.white} />
                    </TouchableOpacity>
                )
            }} />
            <GestureHandlerRootView >
                <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 90, flex: 1 }}>
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
                                        <Text style={styles.price}>đ{formatPriceRender(product.unit_price)}</Text>
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
                                    {isFavorite ? (
                                        <TouchableOpacity onPress={unFavoriteProduct}>
                                            <FontAwesome name="heart" size={20} color={CommonColors.red} />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity onPress={favoriteProduct}>
                                            <FontAwesome name="heart-o" size={20} color={CommonColors.lightGray} />
                                        </TouchableOpacity>
                                    )}
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
                        </Animated.View>
                    )}
                    {/* Shop */}
                    {product && (
                        <Animated.View style={[styles.container, { marginTop: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                            <View style={styles.shopWrapper}>
                                <View style={styles.shopInfoWrapper}>
                                    <View style={{ width: 60, height: 60, overflow: 'hidden', borderRadius: 30 }}>
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
                                <TouchableOpacity style={styles.buttonShopView} onPress={() => navigateToShop(product.shop?.id ?? -1)}>
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
                        <Animated.View style={[styles.container, { marginTop: 10, marginBottom: 10 }]} entering={FadeInDown.delay(800).duration(500)}>
                            <ReviewListComponent
                                preImage={preImage}
                                product={product}
                                reviews={reviews}
                                totalItems={reviewPaginate.totalItems}
                            />
                        </Animated.View>
                    )}
                </ScrollView>
                {/* Button Action */}
                <Animated.View
                    style={styles.buttonWrapper}
                    entering={FadeInDown.delay(500).duration(500).springify()}
                >
                    <TouchableOpacity
                        style={[
                            styles.button,
                            {
                                backgroundColor: CommonColors.white,
                                borderColor: CommonColors.primary,
                                borderWidth: 1,
                            }
                        ]}
                        onPress={() => handleSnapPress(0)}
                    >
                        <Ionicons name="cart-outline" size={20} color={CommonColors.primary} />
                        <Text style={[styles.buttonTxt, { color: CommonColors.primary }]}>Thêm vào giỏ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => handleSnapPress(0)}>
                        <Text style={styles.buttonTxt}>Mua ngay</Text>
                    </TouchableOpacity>
                </Animated.View>
                {product && (
                    <BottomSheet
                        ref={sheetRef}
                        snapPoints={snapPoints}
                        enablePanDownToClose={true}
                        onClose={() => setIsOpenBottomSheet(false)}
                        index={-1}
                        backdropComponent={(props) => (
                            <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
                        )}
                    >
                        <BottomSheetView>
                            <View style={[styles.container]}>
                                <SelectVariantComponent
                                    product={product}
                                    variants={variants}
                                    preImage={preImage}
                                    cartPosition={cartPosition}
                                    handleAddToCart={handleAddToCart}
                                />
                            </View>
                        </BottomSheetView>
                    </BottomSheet>
                )}
            </GestureHandlerRootView>
        </>
    )
}

const styles = ProductDetailStyle;

const reviewStyles = StyleSheet.create({
    reviewWrapper: {
        paddingVertical: 12,
        backgroundColor: CommonColors.white,
    },
    reviewHeader: {
        marginBottom: 12,
        paddingHorizontal: 16
    },
    reviewTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 8,
    },
    ratingSummary: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FF6200',
        marginRight: 8,
    },
    stars: {
        flexDirection: 'row',
        marginRight: 8,
    },
    reviewCount: {
        fontSize: 14,
        color: '#6B7280',
    },
    reviewItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#34D399',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        overflow: 'hidden',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    starContainer: {
        flexDirection: 'row',
    },
    reviewComment: {
        fontSize: 14,
        color: '#1F2937',
        marginBottom: 8,
    },
    reviewDate: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    viewMoreButton: {
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: CommonColors.primary,
        alignItems: 'center',
    },
    viewMoreText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ProductDetailScreen;