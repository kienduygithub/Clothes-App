import { NotificationModel } from "@/src/data/model/notification.model";
import { ActionState } from "../../action.state";
import { NotificationActions } from "@/src/data/store/actions/notification/notification.action";
import { PaginateModel } from "@/src/common/model/paginate.model";

export interface NotificationStoreState {
    notifications: NotificationModel[],
    isLoaded: boolean,
    pagination: PaginateModel,
    unreadCount: number
}

const initialState: NotificationStoreState = {
    notifications: [],
    isLoaded: false,
    pagination: {
        currentPage: 1,
        totalPages: 10,
        totalItems: 0,
        limit: 1,
    } as PaginateModel,
    unreadCount: 0
}

export const NotificationReducer = (state = initialState, action: ActionState) => {
    switch (action.type) {
        case NotificationActions.SAVE_NOTIFICATIONS:
            return {
                ...state,
                notifications: action.data?.notifications ?? [],
                pagination: action.data?.pagination,
                unreadCount: action.data?.unreadCount,
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
        case NotificationActions.SAVE_PAGINATION:
            return {
                ...state,
                pagination: action.data?.pagination
            } as NotificationStoreState;
        case NotificationActions.SAVE_UNREAD_COUNT:
            return {
                ...state,
                unreadCount: action.data?.unreadCount
            } as NotificationStoreState;
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
                pagination: initialState.pagination,
                unreadCount: 0,
                isLoaded: false,
            } as NotificationStoreState;
        default:
            return state;
    }
}