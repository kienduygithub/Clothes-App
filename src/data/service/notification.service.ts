import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchNotificationByUser = async (page: number, limit: number) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.GET(
            `${domain}`,
            `notification?page=${page}&limit=${limit}`
        );
        return response;
    } catch (error) {
        throw error;
    }
}