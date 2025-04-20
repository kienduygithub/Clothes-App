import { CommonColors } from "@/src/common/resource/colors"
import { CategoryModel } from "@/src/data/model/category.model";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import * as CategoryManagement from "@/src/data/management/category.management";
import { AntDesign } from "@expo/vector-icons";

type Props = {
    shop_id: number;
    preImage: string;
}

const { width: WIDTH_SCREEN } = Dimensions.get('screen');

const TabCategoryComponent = ({
    shop_id,
    preImage = ''
}: Props) => {
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const fetchCategories = async () => {
        try {
            console.log('Đang tải lại danh mục...');
            const response = await CategoryManagement.fetchParentCategories();
            console.log('Category: Done!');
            setCategories(response);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                {categories.map((category, index) => (
                    <>
                        <TouchableOpacity style={styles.itemWrapper} key={`${index}-${category.id}-${category.category_name}`}>
                            <Image source={{ uri: `${preImage}/${category.image_url}` }} style={styles.itemImage} />
                            <View style={styles.textWrapper}>
                                <Text style={styles.itemTitle}>{category.category_name}</Text>
                                <Text style={styles.itemCount}>{category.count} sản phẩm</Text>
                            </View>
                            <AntDesign style={{ marginLeft: 'auto' }} name="right" size={14} color={CommonColors.gray} />
                        </TouchableOpacity>
                    </>
                ))}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: CommonColors.extraLightGray
    },
    section: {
        width: WIDTH_SCREEN,
        backgroundColor: CommonColors.white,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: 10,
        paddingTop: 15,
        gap: 10
    },
    itemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    textWrapper: {
        flex: 1,
        justifyContent: 'center'
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: CommonColors.black,
        marginBottom: 4
    },
    itemCount: {
        fontSize: 14,
        color: CommonColors.gray
    },
    itemImage: {
        width: 80,
        height: 60,
        backgroundColor: '#f5f5f5',
        borderRadius: 10
    }
})

export default TabCategoryComponent;