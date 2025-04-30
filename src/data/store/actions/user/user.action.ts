import { UserModel } from "@/src/data/model/user.model";
import { ActionState } from "../../action.state";

export enum UserActions {
    SAVE_INFO_LOGGED = '@User/SaveInfoLogged',
    UPDATE_INFO_LOGGED = '@User/UpdateInfoLogged',
    UPDATE_IMAGE_INFO = '@User/UpdateImageInfo',
    RESET_INFO_LOGGED = '@User/ResetInfoLogged',
    UPDATE_EXPIRES_LOGGED = '@User/UpdateExpiresLogged',
    UPDATE_LOGGED_STATUS = '@User/UpdateLoggedStatus',
}

export const SaveInfoLogged = (data: UserModel) => ({
    type: UserActions.SAVE_INFO_LOGGED,
    data: data
} as ActionState)

export const ResetInfoLogged = () => ({
    type: UserActions.RESET_INFO_LOGGED
} as ActionState)

export const UpdateInfoLogged = (data: UserModel) => ({
    type: UserActions.UPDATE_INFO_LOGGED,
    data: data
} as ActionState)

export const UpdateImageInfo = (image_url: string) => ({
    type: UserActions.UPDATE_IMAGE_INFO,
    data: image_url
} as ActionState)

export const UpdateExpiresLogged = (expires: boolean) => ({
    type: UserActions.UPDATE_EXPIRES_LOGGED,
    data: expires
} as ActionState)

export const UpdateLoggedStatus = (isLogged: boolean) => ({
    type: UserActions.UPDATE_LOGGED_STATUS,
    data: isLogged
} as ActionState)
