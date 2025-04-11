import * as CouponService from "@/src/data/service/coupon.service";
import { CouponModel } from "../model/coupon.model";

export const fetchCouponShopMobile = async (shop_id: number) => {
    try {
        const result = await CouponService.fetchCouponShopMobile(shop_id);
        const response: CouponModel[] = result?.coupons?.map(
            (coupon: any) => new CouponModel().convertObj(coupon)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}

export const saveCouponMobile = async (coupon_id: number) => {
    try {
        await CouponService.saveCouponMobile(coupon_id);
        return true;
    } catch (error) {
        throw error;
    }
}