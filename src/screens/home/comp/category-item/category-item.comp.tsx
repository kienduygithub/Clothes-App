import { CategoryType } from "@/src/data/types/global"
import { Image, Text, TouchableOpacity, View } from "react-native";
import CategoryItemComponentStyle from "./category-item.style";

type Props = {
    item: CategoryType;
    index: number;
}

const CategoryItemComponent = ({ item, index }: Props) => {

    return (
        <TouchableOpacity>
            <View style={styles.itemContainer}>
                <Image source={{ uri: item.image }} style={styles.itemImg} />
                <Text style={styles.itemTxt}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = CategoryItemComponentStyle;

export default CategoryItemComponent;