import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchShopById = async (id: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `shop/${id}/mobile`
        );

        return response;
    } catch (error) {
        throw error;
    }
}