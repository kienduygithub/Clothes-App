import * as ProductService from "../../data/service/product.service";
import { ProductModel } from "../model/product.model";

export const fetchProducts = async () => {
    try {
        const result = await ProductService.fetchProducts();
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchDetailProduct = async (id: number) => {
    try {
        const result = await ProductService.fetchDetailProduct(id);
        const response = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        return response[0];
    } catch (error) {
        throw error;
    }
}