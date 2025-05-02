import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ListRenderItem,
    Image
} from 'react-native';
import axios from 'axios';
import { AppConfig } from '@/src/common/config/app.config';
import ChatbotStyle from './chatbot.style';
import { UserModel } from '@/src/data/model/user.model';
import ChatbotIcon from "@/assets/images/chatbot.svg";
import { CommonColors } from '@/src/common/resource/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

interface ChatbotResponse {
    body: {
        message?: string;
        length?: number;
        content?: string;
        role?: string;
    };
}

const ChatbotScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [preImage, setPreImage] = useState<string>('');

    useEffect(() => {
        loadUserAndHistory();
        fetchPreImage();
    }, [])

    const fetchPreImage = () => {
        const preImage = new AppConfig().getPreImage();
        setPreImage(preImage);
    }

    const loadUserAndHistory = async () => {
        try {
            const storedUser = await new AppConfig().getUserInfo();
            let currentUserId: number;
            if (storedUser && Object.keys(storedUser).length > 0) {
                currentUserId = storedUser.id;
                setUserId(currentUserId);
            } else {
                /** Không có ID người dùng -> Dùng Guest ID **/
                currentUserId = Math.floor(Math.random() * 1000000);
                setUserId(currentUserId);
                let user = new UserModel(currentUserId);
                await new AppConfig().setUserInfo(user);
            }

            /** Fetch chat history **/
            const response = await axios.get<ChatbotResponse>(`${new AppConfig().getDomain()}/chatbot/history?userId=${currentUserId}`)

            if (Array.isArray(response.data?.body)) {
                setMessages(
                    response.data.body.map((msg: any) => ({
                        id: Math.random().toString(),
                        text: msg.content,
                        isUser: msg.role === 'user'
                    }))
                );
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }

    const sendMessage = useCallback(async () => {
        if (!inputText.trim() || !userId) return;

        // Add user message to UI
        const userMessage = {
            id: Math.random().toString(),
            text: inputText,
            isUser: true,
        };

        setMessages((prevMessages: any) => [...prevMessages, userMessage]);
        setLoading(true);
        setInputText('');

        try {
            const response = await axios.post(`${new AppConfig().getDomain()}/chatbot/message`, {
                message: userMessage.text,
                user_id: userId
            });

            if (response.data && response.data.body && response.data.body.message) {
                const botMessage = {
                    id: Math.random().toString(),
                    text: response.data.body.message,
                    isUser: false,
                };
                setMessages((prevMessages: any) => [...prevMessages, botMessage]);
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Add error message
            const errorMessage = {
                id: Math.random().toString(),
                text: 'Xin lỗi, Có vẻ xảy ra sự cố. Vui lòng quay lại sau',
                isUser: false,
            };
            setMessages((prevMessages: any) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const renderMessageItem: ListRenderItem<Message> = ({ item }) => {
        if (item.isUser) {
            return (
                <View style={[styles.messageBubble, styles.userBubble]}>
                    <Text style={[styles.messageText, styles.userText]}>
                        {item.text}
                    </Text>
                </View>
            )
        } else {
            /** Đối với bot thì kiểm tra product IDs và đường dần ảnh **/
            const productIdRegex = /Sản phẩm #(\d+)/g;
            const imageUrlRegex = /\[IMAGE:products\/([\w.-]+(?:\/[\w.-]+)*\.(?:png|jpg|jpeg|gif))\]/g;
            const viewDetailRegex = /\[Xem chi tiết sản phẩm #(\d+)\]/g;

            let message = item.text;
            let productMatches = [...message.matchAll(productIdRegex)];
            let imageMatches = [...message.matchAll(imageUrlRegex)];
            let viewDetailMatches = [...message.matchAll(viewDetailRegex)];
            let cleanMessage = message;
            cleanMessage = cleanMessage.replace(/\s*\[IMAGE:products\/[\w.-]+(?:\/[\w.-]+)*\.(?:png|jpg|jpeg|gif)\]\s*/g, '');

            // Nếu không có product IDs hoặc ảnh, render message bình thường
            if (productMatches.length === 0 && imageMatches.length === 0 && viewDetailMatches.length === 0) {
                return (
                    <View style={[ChatbotStyle.messageBubble, ChatbotStyle.botBubble]}>
                        <Text style={[ChatbotStyle.messageText, ChatbotStyle.botText]}>
                            {cleanMessage}
                        </Text>
                    </View>
                );
            }

            // Chuẩn bị các component với đường dẫn links và ảnh
            const messageComponents = [];

            messageComponents.push(
                <Text key={`text-${message.length}`} style={[ChatbotStyle.messageText, ChatbotStyle.botText]}>
                    {cleanMessage}
                </Text>
            );

            // Thêm ảnh (nếu có)
            if (imageMatches.length > 0) {
                const imageComponents = [];

                for (const match of imageMatches) {
                    const imageUrl = match[1];
                    // Remove any escaped backslashes if present
                    const cleanImageUrl = imageUrl.replace(/\\/g, '');
                    imageComponents.push(
                        <Image
                            key={`image-${cleanImageUrl}`}
                            source={{ uri: `${preImage}/${cleanImageUrl}` }}
                            style={styles.messageImage}
                            resizeMode="cover"
                        />
                    );
                    // Hiển thị 1 ảnh đại diện thôi
                    break;
                }

                // Add images in a grid-like layout
                messageComponents.push(
                    <View key="image-container" style={ChatbotStyle.imageContainer}>
                        {imageComponents}
                    </View>
                );
            }

            // Thêm nút xem chi tiết (nếu có)
            if (viewDetailMatches.length > 0) {
                for (const match of viewDetailMatches) {
                    const productId = match[1];
                    messageComponents.push(
                        <TouchableOpacity
                            key={`view-detail-${productId}`}
                            style={styles.productButton}
                            onPress={() => handleProductPress(parseInt(productId))}
                        >
                            <Text style={styles.productButtonText}>Xem chi tiết sản phẩm</Text>
                        </TouchableOpacity>
                    );
                }
            }

            return (
                <View style={[ChatbotStyle.messageBubble, ChatbotStyle.botBubble]}>
                    {messageComponents}
                </View>
            )
        }
    };

    const renderTypingIndicator = () => {
        if (!loading) return null;

        return (
            <View style={[styles.messageBubble, styles.botBubble, { flexDirection: 'row', gap: 5 }]}>
                <ActivityIndicator size="small" color="#444" />
                <Text style={[styles.typingText, { fontSize: 16 }]}>...</Text>
            </View>
        );
    };

    const handleProductPress = (productId: number) => {
        router.navigate({
            pathname: "/(routes)/product-details",
            params: {
                id: productId
            }
        })
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color={CommonColors.white} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Shopping Assistant</Text>
                <ChatbotIcon />
            </View>

            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={item => item.id}
                style={styles.messageList}
                contentContainerStyle={styles.messageListContent}
                ListFooterComponent={renderTypingIndicator}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Đặt câu hỏi..."
                    placeholderTextColor="#999"
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!inputText.trim() || loading}
                >
                    <Text style={styles.sendButtonText}>Gửi</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = ChatbotStyle;

export default ChatbotScreen;