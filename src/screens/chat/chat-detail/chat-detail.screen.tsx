import { router, useLocalSearchParams } from "expo-router";
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
        markConversationOnEnter();
        fetchMessages();
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        }
    }, [])

    const markConversationOnEnter = async () => {
        try {
            await ChatMessageMana.markConversationAsRead(parseInt(receiverId));
        } catch (error) {
            console.log("Lỗi khi đánh dấu cuộc trò chuyện đã đọc:", error);
            showToast(MessageError.BUSY_SYSTEM, "error");
        }
    };

    const connectWebSocket = () => {
        const domain = new AppConfig().getDomain();
        const hostMatch = domain.match(/https?:\/\/([^:/]+)/);
        const host = hostMatch ? hostMatch[1] : 'localhost';
        const wsUrl = `ws://${host}:3001`;

        wsRef.current = new WebSocket(wsUrl);
        wsRef.current.onopen = () => {
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

                        /** Đánh dấu tin nhắn mới là đã đọc nếu người dùng là receiver **/
                        if (newMessage.receiverId === userSelector.id) {
                            ChatMessageMana.markMessageAsRead(newMessage.id)
                                .then(() => console.log("Tin nhắn mới đã được đánh dấu đã đọc"))
                                .catch((err) => console.error("Lỗi khi đánh dấu tin nhắn: ", err));
                        }
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
                    case WebSocketNotificationType.CONVERSATION_READ: {
                        console.log("Cuộc trò chuyện đã được đánh dấu đã đọc:", data);
                        break;
                    }
                    case WebSocketNotificationType.SHOP_STATUS: {
                        console.log('Trạng thái Shop: ', data.shopId, data.isOnline);
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

    const groupMessages = () => {
        const grouped: { timestamp: string; messages: ChatMessageModel[] }[] = [];
        let currentGroup: ChatMessageModel[] = [];
        let lastTimestamp: moment.Moment | null = null;
        const timeThreshold = 15; // 15 minutes
        const today = moment().startOf('day'); // Current date at 00:00:00

        messages.forEach((msg, index) => {
            const currentTime = moment(msg.createdAt);

            if (lastTimestamp === null) {
                currentGroup.push(msg);
                lastTimestamp = currentTime;
            } else if (currentTime.diff(lastTimestamp, 'minutes') >= timeThreshold) {
                if (currentGroup.length > 0) {
                    grouped.push({
                        timestamp: currentTime.isSame(today, 'day')
                            ? lastTimestamp.format('HH:mm')
                            : lastTimestamp.format('DD/MM/YYYY HH:mm'),
                        messages: currentGroup,
                    });
                }
                currentGroup = [msg];
                lastTimestamp = currentTime;
            } else {
                currentGroup.push(msg);
            }

            // Push the last group
            if (index === messages.length - 1 && currentGroup.length > 0) {
                grouped.push({
                    timestamp: currentTime.isSame(today, 'day')
                        ? lastTimestamp.format('HH:mm')
                        : lastTimestamp.format('DD/MM/YYYY HH:mm'),
                    messages: currentGroup,
                });
            }
        });

        return grouped;
    }

    const renderMessageGroup = ({ item }: { item: { timestamp: string; messages: ChatMessageModel[] } }) => {
        return (
            <View style={styles.messageGroup}>
                <View style={styles.timestampContainer}>
                    <Text style={styles.timestampText}>{item.timestamp}</Text>
                </View>
                {item.messages.map((msg, index) => {
                    const isOwnMessage = msg.senderId === userSelector.id;

                    return (
                        <View
                            key={msg.id}
                            style={[
                                styles.messageContainer,
                                isOwnMessage ? styles.ownMessage : styles.otherMessage,
                            ]}
                        >
                            {!isOwnMessage && msg.sender && (
                                <Image
                                    source={{ uri: `${new AppConfig().getPreImage()}/${msg.sender.image_url}` }}
                                    style={styles.avatar}
                                />
                            )}
                            <View
                                style={[
                                    styles.messageBubble,
                                    isOwnMessage ? styles.ownBubble : styles.otherBubble,
                                    index === 0 && styles.firstBubble,
                                    index === item.messages.length - 1 && styles.lastBubble,
                                ]}
                            >
                                {msg.messageType === 'image' && msg.attachments?.map((att, attIndex) => (
                                    <Image
                                        key={attIndex}
                                        source={{ uri: att.url }}
                                        style={styles.imageMessage}
                                        resizeMode="cover"
                                    />
                                ))}
                                {msg.message && (
                                    <Text
                                        style={[
                                            styles.messageText,
                                            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
                                        ]}
                                    >
                                        {msg.message}
                                    </Text>
                                )}
                            </View>
                            {isOwnMessage && index === item.messages.length - 1 && msg.status && (
                                <View style={styles.statusContainer}>
                                    {msg.status === StatusMessage.SENDING && (
                                        <ActivityIndicator size="small" color="#0084ff" />
                                    )}
                                    {msg.status === StatusMessage.SENT && !msg.isRead && (
                                        <Text style={styles.statusText}>Đã gửi</Text>
                                    )}
                                    {msg.status === StatusMessage.SENT && msg.isRead && (
                                        <Ionicons name="checkmark-done" size={16} color="#4CAF50" />
                                    )}
                                    {msg.status === 'failed' && (
                                        <Text style={[styles.statusText, styles.errorText]}>
                                            lỗi gửi tin nhắn
                                        </Text>
                                    )}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        );
    }

    const groupedMessages = groupMessages();

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back-outline" size={24} color="black" />
                </TouchableOpacity>
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
                data={groupedMessages}
                renderItem={renderMessageGroup}
                keyExtractor={(item, index) => `group-${index}`}
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