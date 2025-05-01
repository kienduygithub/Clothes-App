import { FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import SearchStyle from "./search.style";
import { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements"
import Animated, { FadeInDown } from "react-native-reanimated";
import * as CategoryManagement from "../../data/management/category.management";
import { CategoryModel } from "@/src/data/model/category.model";
import { AppConfig } from "@/src/common/config/app.config";
import { CommonColors } from "@/src/common/resource/colors";

type Props = {

}

const SearchScreen = (props: Props) => {
    const [preImage, setPreImage] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    useEffect(() => {
        fetchPreImage();
        fetchCategories();
        setIsLoading(false)
    }, [])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            console.log('Đang tải lại danh mục...');
            const response = await CategoryManagement.fetchParentCategories();
            console.log('Category: Done!');
            setCategories(response);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchCategories();
        setRefreshing(false);
    }

    const navigateCategorySearch = (parent_id: number) => {
        router.navigate({
            pathname: "/(routes)/category-search",
            params: {
                id: parent_id,
                search: ''
            }
        })
    }

    const headerHeight = useHeaderHeight();
    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Danh mục',
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
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[CommonColors.primary]} />
                    }
                    renderItem={({ index, item }) => (
                        <Animated.View entering={FadeInDown.delay(200 + (index * 100)).duration(300)}>
                            <TouchableOpacity onPress={() => navigateCategorySearch(item.id)} style={styles.itemWrapper}>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.itemTitle}>{item.category_name}</Text>
                                    <Text style={styles.itemCount}>{item.count} sản phẩm</Text>
                                </View>
                                <Image source={{ uri: `${preImage}/${item.image_url}` }} style={styles.itemImage} />
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                />
            </View>
        </>
    );
};

const styles = SearchStyle;

export default SearchScreen;
