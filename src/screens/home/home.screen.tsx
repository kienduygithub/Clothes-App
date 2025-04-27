import { router, Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import HomeStyle from "./home.style";
import HeaderComponent from "@/src/components/header/header.comp";
import ProductListComponent from "./comp/product-list/product-list.comp";
import CategoryListComponent from "./comp/category-list/category-list.comp";
import FlashSaleComponent from "./comp/flash-sale/flash-sale.comp";
import { ActivityIndicator, Image, ScrollView, View } from "react-native";
import { CategoryModel } from "@/src/data/model/category.model";
import { AppConfig } from "@/src/common/config/app.config";
import * as CategoryManagement from "../../data/management/category.management";
import * as ProductManagement from "../../data/management/product.management";
import { ProductModel } from "@/src/data/model/product.model";
import SearchOverlayComponent from "@/src/components/search-overlay/search-overlay.component";

const HomeScreen = () => {
    const [preImage, setPreImage] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [refreshCategory, setRefreshCategory] = useState(false);
    const [refreshProduct, setRefreshProduct] = useState(false);
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [categories, setCategories] = useState<CategoryModel[]>([]);
    const [isSearchOverlayVisible, setSearchOverlayVisible] = useState(false);
    const firstFetching = useRef(true);

    useEffect(() => {
        fetchPreImage();
        fetchCategories();
        fetchProducts();
        setIsLoading(false)
        firstFetching.current = false;
    }, [])

    useEffect(() => {
        if (firstFetching.current) {
            return;
        }
        if (refreshCategory) {
            fetchCategories();
            setRefreshCategory(false);
        }
    }, [refreshCategory])

    useEffect(() => {
        if (firstFetching.current) {
            return;
        }
        if (refreshProduct) {
            fetchProducts();
            setRefreshProduct(false);
        }
    }, [refreshProduct])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchProducts = async () => {
        try {
            const response = await ProductManagement.fetchProducts();
            console.log('Sản phẩm: Done!');
            setProducts(response);
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

    const onHandleSearch = (searchValue: string) => {
        router.push({
            pathname: '/(routes)/search-result',
            params: {
                search: searchValue
            }
        })
        setSearchOverlayVisible(false);
    }

    return (
        <>
            <HeaderComponent openSearch={() => setSearchOverlayVisible(true)} />
            {
                isLoading ? (
                    <View style={{ marginTop: 30 }}>
                        <ActivityIndicator size={'large'} />
                    </View>
                ) : (
                    <>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <CategoryListComponent categories={categories} preImage={preImage} setRefreshCategory={setRefreshCategory} />
                            <FlashSaleComponent preImage={preImage} products={products} />
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
                            <ProductListComponent preImage={preImage} products={products} flatlist={false} />
                        </ScrollView>
                        <SearchOverlayComponent isVisible={isSearchOverlayVisible} onHandleSearch={onHandleSearch} onClose={() => setSearchOverlayVisible(false)} />
                    </>
                )
            }
        </>
    );
};

const styles = HomeStyle;

export default HomeScreen;
