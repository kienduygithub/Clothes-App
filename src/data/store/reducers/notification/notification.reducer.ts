import { NotificationModel } from "@/src/data/model/notification.model";
import { ActionState } from "../../action.state";
import { NotificationActions } from "@/src/data/store/actions/notification/notification.action";

export interface NotificationStoreState {
    notifications: NotificationModel[],
    isLoaded: boolean
}

const initialState: NotificationStoreState = {
    notifications: [],
    isLoaded: false
}

export const NotificationReducer = (state = initialState, action: ActionState) => {
    switch (action.type) {
        case NotificationActions.SAVE_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data,
                isLoaded: true
            } as NotificationStoreState;
        case NotificationActions.CHANGE_IS_LOADED_STATE:
            return {
                ...state,
                isLoaded: action.data?.isLoaded
            } as NotificationStoreState;
        case NotificationActions.ADD_NOTIFICATION: {
            const notification = action.data.notification;
            const currNotifications = [...state.notifications];
            currNotifications.unshift(notification);
            return {
                ...state,
                notifications: currNotifications
            } as NotificationStoreState;
        }
        case NotificationActions.MARK_NOTIFICATION_AS_READ: {
            const currNotifications = [...state.notifications];
            const markedNotification = currNotifications.find(item => item.id === action?.data?.notification_id);
            if (markedNotification) {
                markedNotification.is_read = true;
            }

            return {
                ...state,
                notifications: currNotifications
            } as NotificationStoreState;
        }
        case NotificationActions.RESET_STATE:
            return {
                ...state,
                notifications: [],
                isLoaded: false
            } as NotificationStoreState;
        default:
            return state;
    }
}