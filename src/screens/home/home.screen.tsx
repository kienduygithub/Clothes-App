import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import HomeStyle from "./home.style";
import { CategoryType, ProductType } from "@/src/data/types/global";
import HeaderComponent from "@/src/components/header/header.comp";
import ProductListComponent from "./comp/product-list/product-list.comp";
import CategoryListComponent from "./comp/category-list/category-list.comp";
import FlashSaleComponent from "./comp/flash-sale/flash-sale.comp";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import * as CategoryManagement from "../../data/management/category.management";
import { CategoryModel } from "@/src/data/model/category.model";
import { AppConfig } from "@/src/common/config/app.config";
import axios from "axios";

const HomeScreen = () => {
    const [preImage, setPreImage] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshCategory, setRefreshCategory] = useState(false);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [saleProducts, setSaleProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);

    useEffect(() => {
        fetchPreImage();
        fetchCategories();
        fetchSaleProducts();
        fetchProducts();
        setIsLoading(false)
    }, [])

    useEffect(() => {
        if (refreshCategory) {
            fetchCategories();
            setRefreshCategory(false);
        }
    }, [refreshCategory])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchProducts = async () => {
        try {
            // const url = `http://192.168.1.30:8000/products`;
            // const response = await axios.get(url);
            // setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const response = await CategoryManagement.fetchParentCategories();
            console.log('Danh mục: Done!');
            setCategories(response);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSaleProducts = async () => {
        try {
            const url = `http://192.168.1.38:8000/saleProducts`;
            const response = await axios.get(url);
            setSaleProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    header: () => <HeaderComponent />
                }}
            />
            {
                isLoading ? (
                    <View style={{ marginTop: 30 }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <CategoryListComponent categories={categories} preImage={preImage} setRefreshCategory={setRefreshCategory} />
                        <FlashSaleComponent products={saleProducts} />
                        <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
                            <Image
                                source={require("@/assets/images/sale-banner.jpg")}
                                style={{
                                    width: "100%",
                                    height: 150,
                                    borderRadius: 15
                                }}
                            />
                        </View>
                        <ProductListComponent products={products} flatlist={false} />
                    </ScrollView>
                )
            }
        </>
    );
};

const styles = HomeStyle;

export default HomeScreen;
