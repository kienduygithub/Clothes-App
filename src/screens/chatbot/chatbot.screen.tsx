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

    useEffect(() => {
        loadUserAndHistory();
    }, [])

    const loadUserAndHistory = async () => {
        try {
            const storedUser = await new AppConfig().getUserInfo();
            let currentUserId: number;
            if (storedUser) {
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
    }, [inputText, userId]);

    const renderMessageItem: ListRenderItem<Message> = ({ item }) => (
        <View style={[
            styles.messageBubble,
            item.isUser ? styles.userBubble : styles.botBubble
        ]}>
            <Text style={[
                styles.messageText,
                item.isUser ? styles.userText : styles.botText
            ]}>
                {item.text}
            </Text>
        </View>
    );

    const renderTypingIndicator = () => {
        if (!loading) return null;

        return (
            <View style={[styles.messageBubble, styles.botBubble]}>
                <ActivityIndicator size="small" color="#444" />
                <Text style={styles.typingText}>...</Text>
            </View>
        );
    };

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
                    placeholder="Ask something about our products..."
                    placeholderTextColor="#999"
                    onSubmitEditing={sendMessage}
                />
                <TouchableOpacity
                    style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!inputText.trim() || loading}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = ChatbotStyle;

export default ChatbotScreen;