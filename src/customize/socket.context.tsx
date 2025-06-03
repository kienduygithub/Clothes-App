import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppConfig } from "@/src/common/config/app.config";
import { WebSocketNotificationType } from "@/src/common/resource/websocket";
import { Subject, Observable } from "rxjs";

interface WebSocketContextType {
    subscribe: () => Observable<any>;
    sendMessage: (message: any) => void;
    lastCheckedShopId: number | null;
    setLastCheckedShopId: (shopId: number | null) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: React.ReactNode; userId: number | null }> = ({
    children,
    userId,
}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [lastCheckedShopId, setLastCheckedShopId] = useState<number | null>(null);
    const messageSubject = useRef(new Subject<any>());

    const reconnect = () => {
        if (!userId || isConnecting || (wsRef.current && wsRef.current.readyState === WebSocket.OPEN)) return;
        setIsConnecting(true);
        const domain = new AppConfig().getDomain();
        const hostMatch = domain.match(/https?:\/\/([^:/]+)/);
        const host = hostMatch ? hostMatch[1] : "localhost";
        const wsUrl = `ws://${host}:3001`; // Kiểm tra URL này với backend
        console.log("Kết nối WebSocket tới:", wsUrl);

        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
            setIsConnecting(false);
            console.log("WebSocket kết nối thành công, đăng ký userId:", userId);
            if (wsRef.current && userId) {
                wsRef.current.send(JSON.stringify({
                    type: WebSocketNotificationType.REGISTER,
                    userId
                }));
            }
        };

        wsRef.current.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("WebSocket nhận dữ liệu:", data.type);
                messageSubject.current.next(data); // Phát dữ liệu qua Subject
            } catch (error) {
                console.error("Lỗi phân tích dữ liệu:", error);
            }
        };

        wsRef.current.onerror = (error) => {
            console.error("Lỗi WebSocket:", error);
            setIsConnecting(false);
        };

        wsRef.current.onclose = () => {
            console.log("WebSocket đóng, thử kết nối lại...");
            wsRef.current = null;
            setIsConnecting(false);
            if (userId) {
                setTimeout(reconnect, 2000);
            }
        };
    };

    useEffect(() => {
        reconnect();
        return () => {
            console.log("Ngắt kết nối WebSocket...");
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [userId]);

    const subscribe = () => {
        return messageSubject.current.asObservable();
    };

    const sendMessage = (message: any) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            console.log("Gửi thông báo:", message);
            wsRef.current.send(JSON.stringify(message));
        } else {
            console.log("WebSocket chưa sẵn sàng, không gửi được:", message);
            reconnect(); // Thử kết nối lại nếu WebSocket không sẵn sàng
        }
    };

    return (
        <WebSocketContext.Provider value={{ subscribe, sendMessage, lastCheckedShopId, setLastCheckedShopId }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket phải được dùng trong WebSocketProvider");
    }
    return context;
};