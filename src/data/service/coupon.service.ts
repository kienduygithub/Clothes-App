import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchCouponShopMobile = async (shop_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `coupon/shop/${shop_id}/mobile`
        );
        return response;
    } catch (error) {
        throw error;
    }
}

export const saveCouponMobile = async (coupon_id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.POST(
            `${domain}`,
            `coupon/${coupon_id}/mobile`,
            {}
        );
        return response;
    } catch (error) {
        throw error;
    }
}