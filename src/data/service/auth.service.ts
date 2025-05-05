import { AppConfig } from "@/src/common/config/app.config";
import { ServiceCore } from "@/src/common/service/service.core";
import { AuthModel } from "../model/auth.model";
import { UserModel } from "../model/user.model";
import CustomAxios from "@/src/common/config/axios.config";

export const signIn = async (data: AuthModel) => {
    try {
        const domain = new AppConfig().getDomain();
        const response = await ServiceCore.POST(
            `${domain}`,
            `auth/sign-in/mobile`,
            data
        );

        return response;
    } catch (error) {
        throw error;
    }
}

export const signUp = async (user: UserModel, auth: AuthModel, file: any) => {
    try {
        const domain = new AppConfig().getDomain();
        const formData = new FormData();
        const registerData = new AuthModel().convertRegisterObj(user, auth);
        formData.append('userInfo', JSON.stringify(registerData));
        formData.append('userFile', file);

        const response = await ServiceCore.POST(
            `${domain}`,
            `auth/sign-up/mobile`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        return response;
    } catch (error) {
        throw error;
    }
}