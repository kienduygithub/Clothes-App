import { Image, Text, TouchableOpacity, View } from "react-native";
import ProductItemStyle from "./product-item.style";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link, router } from "expo-router";
import { ProductModel } from "@/src/data/model/product.model";
import { useEffect } from "react";
import { formatPriceRender } from "@/src/common/utils/currency.helper";

type Props = {
    item: ProductModel,
    preImage: string,
    index: number;
    productType: "sale" | "regular"
};

const ProductItemComponent = ({ item, index, preImage, productType }: Props) => {
    const navigateDetails = () => {
        router.navigate({
            pathname: '/(routes)/product-details',
            params: {
                id: item.id,
                shop_id: item.shop?.id ?? 0,
                productType: productType
            }
        })
    }
    return (
        <>
            {item && (

                <TouchableOpacity onPress={navigateDetails}>
                    <Animated.View key={item.id} style={styles.container} entering={FadeInDown.delay(300 + index * 100).duration(500)}>
                        <Image source={{ uri: `${preImage}/${item.product_images[0].image_url}` }} style={styles.productImg} />
                        <TouchableOpacity style={styles.bookmarkBtn}>
                            <FontAwesome name="heart-o" size={18} color={CommonColors.black} />
                        </TouchableOpacity>
                        <View style={styles.productInfo}>
                            <Text style={styles.price}>đ{formatPriceRender(item.unit_price)}</Text>
                            <View style={styles.ratingWrapper}>
                                <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                                <Text style={styles.ratingTxt}>{Number(item.rating).toFixed(1)}</Text>
                            </View>
                        </View>
                        <Text style={styles.title}>{item.product_name}</Text>
                    </Animated.View>
                </TouchableOpacity>
            )}
        </>
    )
}

const styles = ProductItemStyle;

export default ProductItemComponent;