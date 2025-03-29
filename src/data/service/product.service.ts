import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchProducts = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchProductsByShopId = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/shop/${id}/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchDetailProduct = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/${id}/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchProductVariantByProductId = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `product/${id}/variants/mobile`
        )

        return response;
    } catch (error) {
        throw error;
    }
}