import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { UserModel } from "../model/user.model";

export const fetchInfoUser = async () => {
    try {
        const domain = new AppConfig().getDomain();
        const response = ServiceCore.GET(
            `${domain}`,
            `user/info/mobile`,
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const editInfoUser = async (data: UserModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const payload = new UserModel().toJsonExecute(data);
        const response = ServiceCore.PATCH(
            `${domain}`,
            `user/info/mobile`,
            payload
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const editAvatarUser = async (file: any) => {
    try {
        const domain = new AppConfig().getDomain();
        const formData = new FormData();
        formData.append('userFile', file);
        const response = ServiceCore.PATCH(
            `${domain}`,
            `user/avatar/mobile`,
            formData
        );

        return response;
    } catch (error) {
        throw error;
    }
}