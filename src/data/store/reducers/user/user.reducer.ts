import { ActionState } from "../../action.state";
import { UserActions } from "../../actions/user/user.action";

export interface UserStoreState {
    id: number;
    name: string;
    image_url: string;
    cart_id: number;
}

const initialState: UserStoreState = {
    id: 0,
    name: '',
    image_url: '',
    cart_id: 0
}

export const UserReducer = (state = initialState, actions: ActionState) => {
    switch (actions.type) {
        case UserActions.SAVE_INFO_LOGGED:
            return {
                ...state,
                ...actions.data
            }
        case UserActions.UPDATE_INFO_LOGGED:
            return {
                ...state,
                ...actions.data
            }
        case UserActions.UPDATE_IMAGE_INFO:
            return {
                ...state,
                image_url: actions.data
            }
        default:
            return state;
    }
}
