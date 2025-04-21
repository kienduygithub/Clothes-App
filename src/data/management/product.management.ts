import { PaginateModel } from "@/src/common/model/paginate.model";
import * as ProductService from "../../data/service/product.service";
import { ProductModel } from "../model/product.model";
import { ProductVariantModel } from "../model/product_variant.model";
import { ProductPaginate } from "../types/global";

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

export const fetchProductsByShopId = async (id: number) => {
    try {
        const result = await ProductService.fetchProductsByShopId(id);
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

export const fetchProductVariantByProductId = async (id: number) => {
    try {
        const result = await ProductService.fetchProductVariantByProductId(id);
        const response: ProductVariantModel[] = result?.variants?.map(
            (variant: any) => new ProductVariantModel().convertObj(variant)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const searchAndFilterProductMobile = async (
    searchValue: string,
    page: number,
    limit: number
) => {
    try {
        const result = await ProductService.searchAndFilterProductMobile(
            searchValue,
            page,
            limit,
        );
        const products: ProductModel[] = result?.products?.map(
            (product: any) => new ProductModel().convertObj(product)
        ) ?? [];
        const paginate = new PaginateModel().convertObj(result?.paginate);
        const response: ProductPaginate = {
            products: products,
            paginate: paginate
        }

        return response;
    } catch (error) {
        throw error;
    }
}