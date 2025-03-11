import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import HomeStyle from "./home.style";
import axios from "axios";
import { CategoryType, ProductType } from "@/src/data/types/global";
import HeaderComponent from "@/src/components/header/header.comp";
import ProductListComponent from "./comp/product-list/product-list.comp";
import CategoryListComponent from "./comp/category-list/category-list.comp";

const HomeScreen = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [products, setProducts] = useState<ProductType[]>([]);
    const [categories, setCategories] = useState<CategoryType[]>([]);
    useEffect(() => {
        fetchCategories();
        fetchProducts();
        setIsLoading(false)
    }, [])
    const fetchProducts = async () => {
        try {
            const url = `http://192.168.0.103:8000/products`;
            const response = await axios.get(url);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    }

    const fetchCategories = async () => {
        try {
            const url = `http://192.168.0.103:8000/categories`;
            const response = await axios.get(url);
            setCategories(response.data);
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
            <CategoryListComponent categories={categories} />
            <ProductListComponent products={products} />
        </>
    );
};

const styles = HomeStyle;

export default HomeScreen;
