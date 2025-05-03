import * as ReviewService from "@/src/data/service/review.service";
import { ProductReviewModel } from "../model/review.model";

export const fetchListUnreviewPurchaseUser = async () => {
    try {
        const result = await ReviewService.fetchListUnreviewPurchaseUser();
        const response: ProductReviewModel[] = result?.unreviewedPurchases?.map(
            (item: any) => new ProductReviewModel().convertObj(item)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}