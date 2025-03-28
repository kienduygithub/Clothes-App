import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { AuthModel } from "../model/auth.model";

export const signIn = async (data: AuthModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = ServiceCore.POST(
            `${domain}`,
            `auth/sign-in/mobile`,
            data
        );

        return response;
    } catch (error) {
        throw error;
    }
}