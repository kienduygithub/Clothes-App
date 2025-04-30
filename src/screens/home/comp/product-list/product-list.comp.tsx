import ProductListStyle from "./product-list.style"
import ProductItemComponent from "../product-item/product-item.comp"
import { View, TouchableOpacity, FlatList, Text } from "react-native"
import { ProductModel } from "@/src/data/model/product.model"
import { router } from "expo-router"

type Props = {
    products: ProductModel[],
    preImage: string,
    flatlist: boolean
}

const ProductListComponent = ({ products, preImage, flatlist }: Props) => {

    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Dành cho bạn</Text>
                <TouchableOpacity onPress={() => {
                    router.push({
                        pathname: '/(routes)/search-result',
                        params: {
                            search: ''
                        }
                    })
                }}>
                    <Text style={styles.titleBtn}>Tất cả</Text>
                </TouchableOpacity>
            </View>
            {flatlist ? (
                <FlatList
                    data={products}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginBottom: 20
                    }}
                    style={{ marginBottom: 80 }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={
                        ({ index, item }) => (
                            <ProductItemComponent item={item} index={index} preImage={preImage} productType="regular" />
                        )
                    }
                />
            ) : (
                <View style={styles.itemsWrapper}>
                    {products.map((item, index) => (
                        <View key={item.id} style={styles.productWrapper}>
                            <ProductItemComponent item={item} index={index} preImage={preImage} productType="regular" />
                        </View>
                    ))}
                </View>
            )}

        </View>
    )
}

const styles = ProductListStyle;

export default ProductListComponent;