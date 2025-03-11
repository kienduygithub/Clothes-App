import { Image, Text, TouchableOpacity, View } from "react-native";
import ProductItemStyle from "./product-item.style";
import { ProductType } from "@/src/data/types/global";
import { FontAwesome } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Link, useRouter } from "expo-router";

type Props = {
    item: ProductType,
    index: number;
};

const ProductItemComponent = ({ item, index }: Props) => {
    const router = useRouter();
    return (
        <Link href={`/(routes)/product-details?id=${item.id}`} asChild>
            <TouchableOpacity>
                <Animated.View key={item.id} style={styles.container} entering={FadeInDown.delay(300 + index * 100).duration(500)}>
                    <Image source={{ uri: item.images[0] }} style={styles.productImg} />
                    <TouchableOpacity style={styles.bookmarkBtn}>
                        <FontAwesome name="heart-o" size={18} color={CommonColors.black} />
                    </TouchableOpacity>
                    <View style={styles.productInfo}>
                        <Text style={styles.price}>${item.price}</Text>
                        <View style={styles.ratingWrapper}>
                            <FontAwesome name="star" size={18} color={CommonColors.yellow} />
                            <Text style={styles.ratingTxt}>4.8</Text>
                        </View>
                    </View>
                    <Text style={styles.title}>{item.title}</Text>
                </Animated.View>
            </TouchableOpacity>
        </Link>
    )
}

const styles = ProductItemStyle;

export default ProductItemComponent;