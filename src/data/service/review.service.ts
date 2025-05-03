import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { ProductReviewModel } from "../model/review.model";

export const fetchListUnreviewPurchaseUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const response = await ServiceCore.GET(
            `${domain}`,
            `review/user/${userInfo.id}/product/unreview`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const fetchListReviewedPurchaseUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const userInfo = await new AppConfig().getUserInfo();
        const response = await ServiceCore.GET(
            `${domain}`,
            `review/user/${userInfo.id}/product/reviewed`
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const addReviewPurchaseUser = async (data: ProductReviewModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const payload = new ProductReviewModel().convertModelToExecute(data);
        const response = await ServiceCore.POST(
            `${domain}`,
            `review/product/reviewed`,
            payload
        );

        return response;
    } catch (error) {
        throw error;
    }
}