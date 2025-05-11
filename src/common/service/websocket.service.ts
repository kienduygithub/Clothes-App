import { AppConfig } from "../config/app.config";
import { NotificationModel } from "@/src/data/model/notification.model";
import * as NotificationActions from "@/src/data/store/actions/notification/notification.action";
import store from "@/src/data/store/store.config";
import { WebSocketNotificationType } from "../resource/websocket";

export class WebSocketService {
    private socket: WebSocket | null = null;
    private userId: number | null = null;
    private retryCount: number = 0;
    private maxRetries: number = 5;
    private retryInterval: number = 5000;
    private pingInterval: NodeJS.Timeout | null = null;

    public async initialize(): Promise<void> {
        try {
            const userJSON = await new AppConfig().getUserInfo();
            if (userJSON && Object.keys(userJSON).length > 0) {
                const user = userJSON;
                this.userId = user.id;
                this.connect();
            }
        } catch (error) {
            console.error('Error initializing WebSocket:', error);
        }
    }

    private connect(): void {
        try {
            if (!this.userId) {
                console.error('Cannot connect to WebSocket: No user ID');
                return;
            }

            const domain = new AppConfig().getDomain();
            const hostMatch = domain.match(/https?:\/\/([^:/]+)/);
            const host = hostMatch ? hostMatch[1] : 'localhost';
            const wsUrl = `ws://${host}:3001`;

            this.socket = new WebSocket(wsUrl);

            this.socket.onopen = this.handleOpen.bind(this);
            this.socket.onmessage = this.handleMessage.bind(this);
            this.socket.onerror = this.handleError.bind(this);
            this.socket.onclose = this.handleClose.bind(this);

            // Thiết lập ping để duy trì kết nối
            this.setupPingInterval();
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            this.scheduleReconnect();
        }
    }

    private handleOpen(): void {
        console.log('WebSocket connection established');

        this.retryCount = 0;

        // Đăng ký người dùng tới WebSocket
        if (this.socket && this.userId) {
            const message = JSON.stringify({
                type: WebSocketNotificationType.REGISTER,
                userId: this.userId
            });
            this.socket.send(message);
        }
    }

    private handleMessage(event: WebSocketMessageEvent): void {
        try {
            const data = JSON.parse(event.data);

            if (data.type === WebSocketNotificationType.NOTIFICATION && data.notification) {
                const notification = new NotificationModel().convertObj(data.notification);

                store.dispatch(NotificationActions.AddNotification(notification));
                const state = store.getState();
                const currentUnreadCount = state.notification.unreadCount;
                store.dispatch(NotificationActions.SaveUnreadCount(currentUnreadCount + 1));

                // Console.log tiện debug
                this.showLocalNotification(notification);
            }
        } catch (error) {
            console.error('Error handling WebSocket message:', error);
        }
    }

    private showLocalNotification(notification: NotificationModel): void {
        console.log('>>> Notification:', notification);
    }

    private handleError(error: Event): void {
        console.error('WebSocket error:', error);
        this.scheduleReconnect();
    }

    private handleClose(event: CloseEvent): void {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.clearPingInterval();
        this.scheduleReconnect();
    }

    private scheduleReconnect(): void {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`Attempting to reconnect in ${this.retryInterval / 1000} seconds (Attempt ${this.retryCount}/${this.maxRetries})`);

            setTimeout(() => {
                this.connect();
            }, this.retryInterval);
        } else {
            console.error('Maximum reconnection attempts reached.');
        }
    }

    private setupPingInterval(): void {
        this.clearPingInterval();

        this.pingInterval = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(JSON.stringify({ type: WebSocketNotificationType.PING }));
            }
        }, 30000);
    }

    private clearPingInterval(): void {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    /** Update user ID after login **/
    public updateUserId(userId: number): void {
        this.userId = userId;

        // Đóng kết nối
        this.disconnect();

        // Thiết lập kết nối với userId
        this.connect();
    }

    /** Disconnect WebSocket **/
    public disconnect(): void {
        if (this.socket) {
            // Báo WebSocket người dùng đăng xuất
            if (this.socket.readyState === WebSocket.OPEN && this.userId) {
                this.socket.send(JSON.stringify({
                    type: WebSocketNotificationType.LOGOUT,
                    userId: this.userId
                }));
            }

            // Đóng kết nối
            this.socket.close();
            this.socket = null;
        }

        this.clearPingInterval();
    }
}

const websocketService = new WebSocketService();
export default websocketService; 