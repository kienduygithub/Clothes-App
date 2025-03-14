import { FlatList, Image, Text, View } from "react-native";
import SearchStyle from "./search.style";
import { useEffect, useState } from "react";
import { CategoryType, ProductType } from "@/src/data/types/global";
import axios from "axios";
import { Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements"
import Animated, { FadeInDown } from "react-native-reanimated";
type Props = {

}

const SearchScreen = (props: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    const [products, setProducts] = useState<ProductType[]>([]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
        setIsLoading(false)
    }, [])

    const fetchProducts = async () => {
        try {
            const url = `http://192.168.0.101:8000/products`;
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const url = `http://192.168.0.101:8000/categories`;
            const response = await axios.get(url);
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const headerHeight = useHeaderHeight();
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitleAlign: 'center'
                }}
            />
            <View style={[styles.container, { marginTop: headerHeight }]}>
                <FlatList
                    data={categories}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    style={{ marginBottom: 60 }}
                    renderItem={({ index, item }) => (
                        <Animated.View style={styles.itemWrapper} entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Image source={{ uri: item.image }} style={styles.itemImage} />
                        </Animated.View>
                    )}
                />
            </View>
        </>
    );
};

const styles = SearchStyle;

export default SearchScreen;
