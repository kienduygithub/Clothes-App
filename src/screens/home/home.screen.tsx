import { Fonts } from "@/src/common/resource/fonts";
import { Routes } from "@/src/common/resource/routes";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import HomeStyle from "./home.style";
import axios from "axios";
import { ProductType } from "@/src/data/types/global";
import HeaderComponent from "@/src/components/header/header.comp";
import ProductItemComponent from "./comp/product-item/product-item.comp";
import ProductListComponent from "./comp/product-list/product-list.comp";

const HomeScreen = () => {
    const router = useRouter();
    const [products, setProducts] = useState<ProductType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    useEffect(() => {
        fetchProducts();
    }, [])
    const fetchProducts = async () => {
        try {
            const url = `http://192.168.0.103:8000/products`;
            const response = await axios.get(url);
            setProducts(response.data);
            setIsLoading(false);
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
            <ProductListComponent products={products} />
        </>
    );
};

const styles = HomeStyle;

export default HomeScreen;
