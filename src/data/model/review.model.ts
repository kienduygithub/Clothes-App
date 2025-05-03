import { ProductModel } from "./product.model";
import { UserModel } from "./user.model";

export class ReviewModel {
    id: number;
    user: UserModel | undefined;
    product: ProductModel | undefined;
    rating: number;
    comment: string;

    constructor(
        id?: number,
        user?: UserModel | undefined,
        product?: ProductModel | undefined,
        rating?: number,
        comment?: string,
    ) {
        this.id = id ?? 0;
        this.user = user;
        this.product = product;
        this.rating = rating ?? 0;
        this.comment = comment ?? ''
    }

    convertObj(data: any) {
        const model = new ReviewModel();
        this.id = data?.id ?? 0;
        this.user = data?.user ? new UserModel().convertObj(data.user) : undefined;
        this.product = data?.product ? new ProductModel().convertObj(data.product) : undefined;
        this.rating = data?.rating ?? 0;
        this.comment = data?.comment ?? '';

        return model;
    }

    convertModelToExecute(data: ReviewModel) {
        return {
            rating: data.rating,
            comment: data.comment
        }
    }
}

export class ProductReviewModel {
    id: number;
    user: UserModel | undefined;
    review: ReviewModel | undefined;
    product_id: number;
    product_name: string;
    image_url: string;
    purchased_at: Date | null;
    created_at: Date | null;

    constructor(
        id?: number,
        user?: UserModel | undefined,
        review?: ReviewModel | undefined,
        product_id?: number,
        product_name?: string,
        image_url?: string,
        purchased_at?: Date | null,
        created_at?: Date | null,
    ) {
        this.id = id ?? 0;
        this.user = user;
        this.review = review;
        this.product_id = product_id ?? 0;
        this.product_name = product_name ?? '';
        this.image_url = image_url ?? '';
        this.purchased_at = purchased_at ?? null;
        this.created_at = created_at ?? null;
    }

    convertObj(data: any) {
        const obj = new ProductReviewModel();
        obj.id = data?.id ?? 0;
        obj.user = data?.user ? new UserModel().convertObj(data.user) : undefined;
        obj.review = data?.review ? new ReviewModel().convertObj(data.review) : undefined;
        obj.product_id = data?.product_id ?? 0;
        obj.product_name = data?.product_name ?? '';
        obj.image_url = data?.image_url ?? '';
        obj.purchased_at = data?.purchased_at ?? null;
        obj.created_at = data?.created_at ?? null;

        return obj;
    }
}