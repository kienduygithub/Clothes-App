import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

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