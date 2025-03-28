import { AuthModel } from "../model/auth.model";
import * as AuthService from "../service/auth.service";

export const signIn = async (data: AuthModel) => {
    try {
        const result = await AuthService.signIn(data);
        return result;
    } catch (error) {
        throw error;
    }
}