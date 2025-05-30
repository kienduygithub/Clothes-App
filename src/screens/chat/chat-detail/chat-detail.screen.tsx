import { useLocalSearchParams } from "expo-router";
import ChatDetailStyle from "./chat-detail.style";
import * as ChatMessageMana from "@/src/data/management/chat-message.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { useSelector } from "react-redux";
import { RootState } from "@/src/data/types/global";
import { useEffect, useRef, useState } from "react";
import { ChatAttachment, ChatMessageModel, StatusMessage } from "@/src/data/model/chat-message.model";
import { ActivityIndicator, FlatList, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from "@/src/customize/toast.context";
import { MessageError } from "@/src/common/resource/message-error";
import { ImageInfo } from "expo-image-picker";
import ChatImagePicker from "../image-picker/image-picker.component";
import { Ionicons } from "@expo/vector-icons";
import { AppConfig } from "@/src/common/config/app.config";
import { WebSocketNotificationType } from "@/src/common/resource/websocket";
import { UserModel } from "@/src/data/model/user.model";
import moment from "moment";

type Props = {}

const ChatDetailScreen = (props: Props) => {
    const { id: receiverId, shopId } = useLocalSearchParams<{
        id: string,
        shopId: string,
    }>();
    const { showToast } = useToast();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessageModel[]>([]);
    const [otherUser, setOtherUser] = useState<UserModel | null>(null);
    const [isOtherUserOnline, setIsOtherUserOnline] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const flatListRef = useRef<FlatList>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const lastCheckedShopId = useRef<number | null>(null);

    useEffect(() => {
        connectWebSocket();
        fetchMessages();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        }
    }, [])

    const connectWebSocket = () => {
        const domain = new AppConfig().getDomain();
        const hostMatch = domain.match(/https?:\/\/([^:/]+)/);
        const host = hostMatch ? hostMatch[1] : 'localhost';
        const wsUrl = `ws://${host}:3001`;

        wsRef.current = new WebSocket(wsUrl);
        wsRef.current.onopen = () => {
            /** Đăng ký user với WebSocket khi kết nối thành công **/
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({
                    type: WebSocketNotificationType.REGISTER,
                    userId: userSelector.id
                }));
            }
        }
        wsRef.current.onmessage = (event: WebSocketMessageEvent) => {
            try {
                const data = JSON.parse(event.data);

                switch (data.type) {
                    case WebSocketNotificationType.NEW_MESSAGE: {
                        const newMessage = new ChatMessageModel().fromJson(data.data, new AppConfig().getPreImage());
                        setMessages(prev => [...prev, newMessage]);
                        flatListRef.current?.scrollToEnd();
                        break;
                    }
                    case WebSocketNotificationType.MESSAGE_READ: {
                        setMessages(prev => prev.map(
                            msg => {
                                if (msg.id === data.messageId) {
                                    let chat = new ChatMessageModel().fromJson(msg, new AppConfig().getPreImage());
                                    chat.isRead = true;

                                    return chat;
                                }

                                return msg;
                            }
                        ));
                        break;
                    }
                    case WebSocketNotificationType.SHOP_STATUS: {
                        const targetShopId: number = parseInt(shopId) || (otherUser && otherUser.shopId ? otherUser.shopId : 0);
                        if (targetShopId && data.shopId === targetShopId) {
                            setIsOtherUserOnline(data.isOnline);
                            lastCheckedShopId.current = data.shopId;
                        }
                        break;
                    }
                }
            } catch (error) {
                console.log('>>> Error parsing Websocket message: ', error);
            }
        }

        wsRef.current.onerror = (error) => {
            console.error('WebSocket connection error:', error);
            setIsOtherUserOnline(false);
        }

        wsRef.current.onclose = () => {
            console.log('WebSocket connection closed');
            /** Đóng kết nối thì kiểm tra lại trạng thái reconnect nếu cần **/
            setTimeout(() => {
                connectWebSocket();
                const targetShopId = shopId ? parseInt(shopId) : otherUser?.shopId;
                if (targetShopId && !isNaN(targetShopId) && wsRef.current?.readyState === WebSocket.OPEN && lastCheckedShopId.current !== targetShopId) {
                    wsRef.current.send(JSON.stringify({
                        type: WebSocketNotificationType.CHECK_SHOP_STATUS,
                        shopId: targetShopId
                    }))

                    setTimeout(() => {
                        if (isOtherUserOnline === undefined) {
                            setIsOtherUserOnline(false);
                        }
                    }, 5000)
                }
            }, 5000);
        };
    }

    const fetchMessages = async () => {
        try {
            const response = await ChatMessageMana.fetchChatHistory(+receiverId);
            setMessages(response);
            if (response.length > 0) {
                const user = response[0].senderId === parseInt(receiverId)
                    ? response[0].sender
                    : response[0].receiver;
                setOtherUser(user);

                const targetShopId = shopId ? parseInt(shopId) : otherUser?.shopId;
                if (targetShopId && !isNaN(targetShopId) && wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: WebSocketNotificationType.CHECK_SHOP_STATUS,
                        shopId: targetShopId
                    }));

                    setTimeout(() => {
                        if (isOtherUserOnline === undefined) {
                            setIsOtherUserOnline(false);
                        }
                    }, 5000);
                } else {
                    setIsOtherUserOnline(false);
                }
            } else {
                // Nếu không có tin nhắn, kiểm tra shopId từ params
                if (shopId && wsRef.current?.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: WebSocketNotificationType.CHECK_SHOP_STATUS,
                        shopId: parseInt(shopId)
                    }));
                    setTimeout(() => {
                        if (isOtherUserOnline === undefined) {
                            setIsOtherUserOnline(false);
                        }
                    }, 5000);
                } else {
                    setIsOtherUserOnline(false);
                }
            }
        } catch (error: any) {
            console.log(error);
            if (error?.message === 'Unauthorized to view these messages') {
                showToast(MessageError.UNAUTHORIZED_VIEW_MESSAGES, 'error');
                return;
            }
            showToast(MessageError.BUSY_SYSTEM, 'error');
            setIsOtherUserOnline(false);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || (!userSelector.isLogged && !userSelector.expires)) {
            return;
        }

        const tempMessage = ChatMessageModel.createMessage({
            senderId: userSelector.id,
            receiverId: parseInt(receiverId),
            message: message.trim(),
            messageType: 'text'
        });

        setMessages(prev => [...prev, tempMessage]);
        setMessage('');

        flatListRef.current?.scrollToEnd();

        try {
            const response = await ChatMessageMana.createMessage(tempMessage);
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id
                    ? { ...response, status: StatusMessage.SENT } as ChatMessageModel
                    : msg
            ));
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const handleImageSelect = async (images: Array<{ uri: string }>) => {
        if (!images && !userSelector.isLogged && !userSelector.expires) {
            return;
        }

        const imagesInfo: ChatAttachment[] = [];

        const tempMessage = ChatMessageModel.createMessage({
            senderId: userSelector.id,
            receiverId: parseInt(receiverId),
            message: '',
            messageType: 'image',
            attachments: imagesInfo.map(img => ({
                url: img.url,
                type: img.type,
                name: img.name,
                size: img.size
            } as ChatAttachment))
        })

        setMessages(prev => [...prev, tempMessage]);

        flatListRef.current?.scrollToEnd();

        try {
            const response = await ChatMessageMana.createMessage(tempMessage);
            setMessages(prev => prev.map(msg =>
                msg.id === tempMessage.id
                    ? { ...response, status: StatusMessage.SENT } as ChatMessageModel
                    : msg
            ));
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const renderMessage = ({ item }: { item: ChatMessageModel }) => {
        const isOwnMessage = item.senderId === userSelector.id;

        return (
            <View style={[
                styles.messageContainer,
                isOwnMessage ? styles.ownMessage : styles.otherMessage
            ]}>
                {!isOwnMessage && item.sender && (
                    <Image
                        source={{ uri: `${new AppConfig().getPreImage()}/${item.sender.image_url}` }}
                        style={styles.avatar}
                    />
                )}
                <View style={[
                    styles.messageBubble,
                    isOwnMessage ? styles.ownBubble : styles.otherBubble
                ]}>
                    {item.messageType === 'image' && item.attachments?.map((att, index) => (
                        <Image
                            key={index}
                            source={{ uri: att.url }}
                            style={styles.imageMessage}
                            resizeMode="cover"
                        />
                    ))}
                    {item.message && (
                        <Text style={[
                            styles.messageText,
                            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
                        ]}>
                            {item.message}
                        </Text>
                    )}
                </View>
                <View style={styles.messageFooter}>
                    <Text style={styles.timeText}>
                        {moment(item.createdAt).format('HH:mm')}
                    </Text>
                    {isOwnMessage && item.status && (
                        <View style={styles.statusContainer}>
                            {item.status === StatusMessage.SENDING && (
                                <ActivityIndicator size="small" color="#0084ff" />
                            )}
                            {item.status === StatusMessage.SENT && !item.isRead && (
                                <Text style={styles.statusText}>Đã gửi</Text>
                            )}
                            {item.status === 'failed' && (
                                <Text style={[styles.statusText, styles.errorText]}>
                                    lỗi gửi tin nhắn
                                </Text>
                            )}
                        </View>
                    )}
                </View>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.header}>
                <Image
                    source={{ uri: `${new AppConfig().getPreImage()}/${otherUser?.image_url}` }}
                    style={styles.headerAvatar}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{otherUser?.name || 'Cửa hàng'}</Text>
                    {otherUser && (
                        <View style={styles.onlineStatusContainer}>
                            <View style={[
                                styles.onlineIndicator,
                                isOtherUserOnline ? styles.onlineIndicatorActive : styles.onlineIndicatorInactive
                            ]} />
                            <Text style={styles.headerStatus}>
                                {isOtherUserOnline ? 'Đang hoạt động' : 'Không hoạt động'}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id + ''}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            <View style={styles.inputContainer}>
                <ChatImagePicker onImageSelect={handleImageSelect} />
                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    placeholder="Aa"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                {message.trim() ? (
                    <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                        <Ionicons name="send" size={24} color="#0084ff" />
                    </TouchableOpacity>
                ) : null}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = ChatDetailStyle;

export default ChatDetailScreen;