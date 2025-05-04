import * as ReviewService from "@/src/data/service/review.service";
import { ProductReviewModel, ReviewModel } from "../model/review.model";

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

export const fetchListReviewedPurchaseUser = async () => {
    try {
        const result = await ReviewService.fetchListReviewedPurchaseUser();
        const response: ProductReviewModel[] = result?.reviewedPurchases?.map(
            (item: any) => new ProductReviewModel().convertObj(item)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}

export const addReviewPurchaseUser = async (data: ProductReviewModel) => {
    try {
        const result = await ReviewService.addReviewPurchaseUser(data);
        return new ReviewModel().convertObj(result?.updatedReviews[0]);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

