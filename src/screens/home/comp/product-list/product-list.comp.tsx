import { ProductType } from "@/src/data/types/global"
import ProductListStyle from "./product-list.style"
import ProductItemComponent from "../product-item/product-item.comp"
import { View, TouchableOpacity, FlatList, Text } from "react-native"

type Props = {
    products: ProductType[],
    flatlist: boolean
}

const ProductListComponent = ({ products, flatlist }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.title}>Dành cho bạn</Text>
                <TouchableOpacity>
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
                            <ProductItemComponent item={item} index={index} />
                        )
                    }
                />
            ) : (
                <View style={styles.itemsWrapper}>
                    {products.map((item, index) => (
                        <View key={item.id} style={styles.productWrapper}>
                            <ProductItemComponent item={item} index={index} />
                        </View>
                    ))}
                </View>
            )}

        </View>
    )
}

const styles = ProductListStyle;

export default ProductListComponent;