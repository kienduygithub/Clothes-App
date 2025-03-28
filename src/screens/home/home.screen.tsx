import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import HomeStyle from "./home.style";
import axios from "axios";
import { CategoryType, ProductType } from "@/src/data/types/global";
import HeaderComponent from "@/src/components/header/header.comp";
import ProductListComponent from "./comp/product-list/product-list.comp";
import CategoryListComponent from "./comp/category-list/category-list.comp";
import FlashSaleComponent from "./comp/flash-sale/flash-sale.comp";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { CommonColors } from "@/src/common/resource/colors";

const HomeScreen = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [saleProducts, setSaleProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);

    useEffect(() => {
        fetchCategories();
        fetchSaleProducts();
        fetchProducts();
        setIsLoading(false)
    }, [])

    const fetchProducts = async () => {
        try {
            const url = `http://192.168.1.30:8000/products`;
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const url = `http://192.168.1.30:8000/categories`;
            const response = await axios.get(url);
            setCategories(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchSaleProducts = async () => {
        try {
            const url = `http://192.168.1.30:8000/saleProducts`;
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
                        <CategoryListComponent categories={categories} />
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
