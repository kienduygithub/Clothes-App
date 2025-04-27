import { UserModel } from "@/src/data/model/user.model";
import { ActionState } from "../../action.state";

export enum UserActions {
    SAVE_INFO_LOGGED = '@User/SaveInfoLogged',
    UPDATE_INFO_LOGGED = '@User/UpdateInfoLogged',
    UPDATE_IMAGE_INFO = '@User/UpdateImageInfo',
}

export const SaveInfoLogged = (data: UserModel) => ({
    type: UserActions.SAVE_INFO_LOGGED,
    data: data
} as ActionState)

export const UpdateInfoLogged = (data: UserModel) => ({
    type: UserActions.UPDATE_INFO_LOGGED,
    data: data
} as ActionState)

export const UpdateImageInfo = (image_url: string) => ({
    type: UserActions.UPDATE_IMAGE_INFO,
    data: image_url
})
