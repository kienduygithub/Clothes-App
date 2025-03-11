import { FlatList, Text, TouchableOpacity, View } from "react-native"
import CategoryListComponentStyle from "./category-list.style"
import { CategoryType } from "@/src/data/types/global"
import CategoryItemComponent from "../category-item/category-item.comp"

type Props = {
    categories: CategoryType[]
}

const CategoryListComponent = ({ categories }: Props) => {
    return (
        <>
            <View>
                <View style={styles.titleWrapper}>
                    <Text style={styles.title}>Danh mục</Text>
                    <TouchableOpacity>
                        <Text style={styles.titleBtn}>See all</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => `${item.id}`}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ index, item }) => (
                        <CategoryItemComponent item={item} index={index} />
                    )}
                />
            </View>
        </>
    )
}

const styles = CategoryListComponentStyle;

export default CategoryListComponent;