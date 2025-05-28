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

type Props = {}

const ChatDetailScreen = (props: Props) => {
    const { id: receiverId } = useLocalSearchParams<{
        id: string
    }>();
    const { showToast } = useToast();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessageModel[]>([]);
    const inputRef = useRef<TextInput>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchMessages();
    }, [])

    const fetchMessages = async () => {
        try {
            const response = await ChatMessageMana.fetchChatHistory(+receiverId);
            setMessages(response);
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

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
        if (!userSelector.isLogged && !userSelector.expires) {
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
                {isOwnMessage && item.status && (
                    <View style={styles.statusContainer}>
                        {item.status === 'sending' ? (
                            <ActivityIndicator size="small" color="#0084ff" />
                        ) : (
                            <Text style={styles.statusText}>Đã gửi</Text>
                        )}
                    </View>
                )}
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
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