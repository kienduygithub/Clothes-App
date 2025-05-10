import { NotificationModel } from "@/src/data/model/notification.model";
import { ActionState } from "../../action.state";

export enum NotificationActions {
    SAVE_NOTIFICATIONS = '@Notification/SaveNotifications',
    CHANGE_IS_LOADED_STATE = '@Notification/ChangeIsLoadedState',
    ADD_NOTIFICATION = '@Notification/AddNotification',
    MARK_NOTIFICATION_AS_READ = '@Notification/MarkNotificationAsRead',
    RESET_STATE = '@Notification/ResetState',
}

export const SaveNotifications = (data: NotificationModel[]) => ({
    type: NotificationActions.SAVE_NOTIFICATIONS,
    data: data ?? []
} as ActionState)

export const ChangeIsLoadedState = (isLoaded: boolean) => ({
    type: NotificationActions.CHANGE_IS_LOADED_STATE,
    data: { isLoaded: isLoaded }
} as ActionState)

export const AddNotification = (notification: NotificationModel) => ({
    type: NotificationActions.ADD_NOTIFICATION,
    data: { notification: notification }
} as ActionState)

export const MarkNotificationAsRead = (notification_id: number) => ({
    type: NotificationActions.MARK_NOTIFICATION_AS_READ,
    data: { notification_id: notification_id }
} as ActionState)

export const ResetState = () => ({
    type: NotificationActions.RESET_STATE,
} as ActionState)