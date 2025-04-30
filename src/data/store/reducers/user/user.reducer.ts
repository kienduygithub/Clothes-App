import { ActionState } from "../../action.state";
import { UserActions } from "../../actions/user/user.action";

export interface UserStoreState {
    id: number;
    name: string;
    image_url: string;
    cart_id: number;
    isLogged: boolean;
    expires: boolean;
}

const initialState: UserStoreState = {
    id: 0,
    name: '',
    image_url: '',
    cart_id: 0,
    isLogged: false,
    expires: false
}

export const UserReducer = (state = initialState, actions: ActionState) => {
    switch (actions.type) {
        case UserActions.SAVE_INFO_LOGGED:
            return {
                ...state,
                ...actions.data,
                isLogged: true,
            } as UserStoreState
        case UserActions.RESET_INFO_LOGGED:
            return {
                ...state,
                ...initialState,
            } as UserStoreState
        case UserActions.UPDATE_INFO_LOGGED:
            return {
                ...state,
                ...actions.data
            } as UserStoreState
        case UserActions.UPDATE_IMAGE_INFO:
            return {
                ...state,
                image_url: actions.data
            } as UserStoreState
        case UserActions.UPDATE_EXPIRES_LOGGED:
            return {
                ...state,
                expires: actions.data ?? false
            } as UserStoreState
        case UserActions.UPDATE_LOGGED_STATUS:
            return {
                ...state,
                isLogged: actions.data ?? false
            } as UserStoreState
        default:
            return state;
    }
}
