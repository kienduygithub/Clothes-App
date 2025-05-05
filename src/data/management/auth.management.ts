import { AuthModel } from "../model/auth.model";
import { UserModel } from "../model/user.model";
import * as AuthService from "../service/auth.service";

export const signIn = async (data: AuthModel) => {
    try {
        const result = await AuthService.signIn(data);
        return result;
    } catch (error) {
        throw error;
    }
}

export const signUp = async (user: UserModel, auth: AuthModel, file: any) => {
    try {
        const result = await AuthService.signUp(
            user,
            auth,
            file
        );

        return result;
    } catch (error) {
        throw error;
    }
}