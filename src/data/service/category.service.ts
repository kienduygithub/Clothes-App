import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchParentCategories = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `category/all`
        );
        return response;
    } catch (error) {
        throw error;
    }
}