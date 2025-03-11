import { Text, TouchableOpacity, View } from "react-native"
import ProductDetailStyle from "./product-details.style"
import { useLocalSearchParams } from "expo-router"
import axios from "axios"
import { useEffect, useState } from "react"
import { ProductType } from "@/src/data/types/global"
import ImageSliderComponent from "@/src/components/imageSlider/image-slider.comp"
import { FontAwesome } from "@expo/vector-icons"
import { CommonColors } from "@/src/common/resource/colors"

type Props = {}

const ProductDetailScreen = (props: Props) => {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<ProductType>();

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const url = `http://192.168.0.103:8000/saleProducts/${id}`;
            const response = await axios.get(url);
            setProduct(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <View>
                {product && <ImageSliderComponent images={product.images} />}
                {product && (
                    <View style={styles.container}>
                        <View style={styles.ratingWrapper}>
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
                        </View>

                        <Text>{product.title}</Text>
                    </View>
                )}
            </View>
        </>
    )
}

const styles = ProductDetailStyle;

export default ProductDetailScreen;