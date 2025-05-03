import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";

export const fetchListOrderUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const userLogged = await new AppConfig().getUserInfo();
        const response = await ServiceCore.GET(
            `${domain}`,
            `order/user/${userLogged.id}/mobile`
        );
        return response;
    } catch (error) {
        throw error;
    }
}