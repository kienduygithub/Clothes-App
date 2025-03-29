import { Image, Text, TouchableOpacity, View } from "react-native";
import ProductItemStyle from "./product-item.style";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link } from "expo-router";
import { ProductModel } from "@/src/data/model/product.model";
import { useEffect } from "react";

type Props = {
    item: ProductModel,
    preImage: string,
    index: number;
    productType: "sale" | "regular"
};

const ProductItemComponent = ({ item, index, preImage, productType }: Props) => {

    return (
        <>
            {item && (
                <Link href={{
                    pathname: '/(routes)/product-details',
                    params: { id: item.id, productType: productType }
                }} asChild>
                    <TouchableOpacity>
                        <Animated.View key={item.id} style={styles.container} entering={FadeInDown.delay(300 + index * 100).duration(500)}>
                            <Image source={{ uri: `${preImage}/${item.product_images[0].image_url}` }} style={styles.productImg} />
                            <TouchableOpacity style={styles.bookmarkBtn}>
                                <FontAwesome name="heart-o" size={18} color={CommonColors.black} />
                            </TouchableOpacity>
                            <View style={styles.productInfo}>
                                <Text style={styles.price}>${item.unit_price}</Text>
                                <View style={styles.ratingWrapper}>
                                    <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                                    <Text style={styles.ratingTxt}>{item.rating}</Text>
                                </View>
                            </View>
                            <Text style={styles.title}>{item.product_name}</Text>
                        </Animated.View>
                    </TouchableOpacity>
                </Link>
            )}
        </>
    )
}

const styles = ProductItemStyle;

export default ProductItemComponent;