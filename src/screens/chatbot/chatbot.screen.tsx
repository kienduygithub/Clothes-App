import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ListRenderItem,
    Image,
    ScrollView,
    Alert,
    StyleSheet
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
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
    id: number;
    name: string;
    price: string;
    gender?: string;
    category?: string;
    sizes: string[];
    colors: string[];
    image_url: string;
}

interface SearchResults {
    type: 'products' | 'shops';
    data: Product[] | any[];
}

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    searchResults?: SearchResults;
}

interface ChatbotResponse {
    message: string;
    chatHistory: {
        role: string;
        content: string;
    }[];
    searchResults?: SearchResults;
}

const ChatbotScreen = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [guestSessionId, setGuestSessionId] = useState<string>('');
    const [preImage, setPreImage] = useState<string>('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        loadUserAndHistory();
        fetchPreImage();
    }, []);

    const fetchPreImage = () => {
        const preImage = new AppConfig().getPreImage();
        setPreImage(preImage);
    };

    const loadUserAndHistory = async () => {
        try {
            const storedUser = await new AppConfig().getUserInfo();
            let currentUserId: number;

            if (storedUser && Object.keys(storedUser).length > 0 && storedUser.id) {
                // User is logged in
                currentUserId = storedUser.id;
                setUserId(currentUserId);
                setIsUserLoggedIn(true);

                // Fetch chat history for logged in user
                fetchChatHistory(currentUserId);
            } else {
                // User is not logged in - check for existing session or create a new one
                setIsUserLoggedIn(false);

                try {
                    // Try to get stored sessionId from AsyncStorage
                    const storedSessionId = await AsyncStorage.getItem('guestChatSessionId');

                    if (storedSessionId) {
                        setGuestSessionId(storedSessionId);
                        fetchGuestSession(storedSessionId);
                    } else {
                        // If no stored sessionId, just show initial greeting
                        setMessages([
                            {
                                id: Math.random().toString(),
                                text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                                isUser: false
                            }
                        ]);
                    }
                } catch (error) {
                    console.error("Error loading guest session", error);
                    // Fallback to initial greeting
                    setMessages([
                        {
                            id: Math.random().toString(),
                            text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                            isUser: false
                        }
                    ]);
                }
            }
        } catch (error) {
            console.error('Failed to load user info:', error);
            // Fallback to guest mode with initial greeting
            setIsUserLoggedIn(false);
            setMessages([
                {
                    id: Math.random().toString(),
                    text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                    isUser: false
                }
            ]);
        }
    };

    const fetchChatHistory = async (userId: number) => {
        try {
            const response = await axios.get<{ data: any, success: boolean }>(
                `${new AppConfig().getDomain()}/chatbot/${userId}`
            );

            if (response.data?.data?.messages) {
                const processedMessages = response.data.data.messages.map((msg: any) => ({
                    id: Math.random().toString(),
                    text: msg.content,
                    isUser: msg.role === 'user',
                    searchResults: msg.searchResults
                }));
                setMessages(processedMessages);
            } else {
                // If no history or empty, show initial greeting
                setMessages([
                    {
                        id: Math.random().toString(),
                        text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                        isUser: false
                    }
                ]);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
            // Show initial greeting on error
            setMessages([
                {
                    id: Math.random().toString(),
                    text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                    isUser: false
                }
            ]);
        }
    };

    const fetchGuestSession = async (sessionId: string) => {
        try {
            const response = await axios.get(
                `${new AppConfig().getDomain()}/chatbot/guest-session/${sessionId}`
            );

            if (response.data?.success && response.data?.data?.messages) {
                const processedMessages = response.data.data.messages.map((msg: any) => ({
                    id: Math.random().toString(),
                    text: msg.content,
                    isUser: msg.role === 'user',
                    searchResults: msg.searchResults
                }));
                setMessages(processedMessages);

                // Update session ID in case a new one was created
                if (response.data.data.sessionId) {
                    setGuestSessionId(response.data.data.sessionId);
                    await AsyncStorage.setItem('guestChatSessionId', response.data.data.sessionId);
                }
            } else {
                // If no history or invalid session, show initial greeting
                setMessages([
                    {
                        id: Math.random().toString(),
                        text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                        isUser: false
                    }
                ]);
            }
        } catch (error) {
            console.error('Failed to load guest session:', error);
            // Show initial greeting on error
            setMessages([
                {
                    id: Math.random().toString(),
                    text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                    isUser: false
                }
            ]);
        }
    };

    const sendMessage = useCallback(async () => {
        if (!inputText.trim()) return;

        // Add user message to UI
        const userMessage = {
            id: Math.random().toString(),
            text: inputText,
            isUser: true,
        };

        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setLoading(true);
        setInputText('');

        try {
            // Different API usage for logged-in vs. guest users
            if (isUserLoggedIn) {
                // For logged-in users, we use the regular API with history
                const response = await axios.post(`${new AppConfig().getDomain()}/chatbot/message`, {
                    userId: userId,
                    message: inputText
                });

                if (response.data && response.data.success) {
                    const botMessage: Message = {
                        id: Math.random().toString(),
                        text: response.data.data.message,
                        isUser: false,
                        searchResults: response.data.data.searchResults
                    };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                }
            } else {
                const response = await axios.post(`${new AppConfig().getDomain()}/chatbot/guest-message`, {
                    message: inputText,
                    sessionId: guestSessionId
                });

                if (response.data && response.data.success) {
                    const botMessage: Message = {
                        id: Math.random().toString(),
                        text: response.data.data.message,
                        isUser: false,
                        searchResults: response.data.data.searchResults
                    };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);

                    // Save the session ID if it's new
                    if (response.data.data.sessionId) {
                        setGuestSessionId(response.data.data.sessionId);
                        await AsyncStorage.setItem('guestChatSessionId', response.data.data.sessionId);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
            // Add error message
            const errorMessage = {
                id: Math.random().toString(),
                text: 'Xin lỗi, có vẻ đã xảy ra sự cố. Vui lòng thử lại sau.',
                isUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    }, [inputText, userId, isUserLoggedIn, guestSessionId]);

    const renderProductItem = (product: Product) => (
        <View style={styles.productCard} key={product.id}>
            {product.image_url && (
                <View style={styles.productImageContainer}>
                    <Image
                        source={{ uri: `${preImage}/${product.image_url}` }}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>
            )}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productPrice}>{formatPrice(product.price)} VND</Text>

            {product.sizes && product.sizes.length > 0 && (
                <Text style={styles.productDetail}>Size: {product.sizes.join(', ')}</Text>
            )}

            {product.colors && product.colors.length > 0 && (
                <Text style={styles.productDetail}>Màu: {product.colors.join(', ')}</Text>
            )}

            <TouchableOpacity
                style={styles.viewDetailButton}
                onPress={() => handleProductPress(product.id)}
            >
                <Text style={styles.viewDetailText}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
    );

    const formatPrice = (price: string): string => {
        return parseInt(price).toLocaleString('vi-VN');
    };

    const renderMessageItem: ListRenderItem<Message> = ({ item }) => {
        if (item.isUser) {
            return (
                <View style={[styles.messageBubble, styles.userBubble]}>
                    <Text style={[styles.messageText, styles.userText]}>
                        {item.text}
                    </Text>
                </View>
            );
        } else {
            return (
                <View style={[styles.messageBubble, styles.botBubble]}>
                    <Text style={[styles.messageText, styles.botText]}>
                        {item.text}
                    </Text>

                    {item.searchResults?.type === 'products' && item.searchResults.data.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.productsContainer}
                        >
                            {item.searchResults.data.map((product: Product) =>
                                renderProductItem(product)
                            )}
                        </ScrollView>
                    )}

                    {item.searchResults?.type === 'shops' && item.searchResults.data.length > 0 && (
                        <View style={styles.shopsContainer}>
                            {item.searchResults.data.map((shop: any) => (
                                <View style={styles.shopCard} key={shop.id}>
                                    {shop.logo_url && (
                                        <Image
                                            source={{ uri: `${preImage}/${shop.logo_url}` }}
                                            style={styles.shopLogo}
                                            resizeMode="cover"
                                        />
                                    )}
                                    <Text style={styles.shopName}>{shop.name}</Text>
                                    {shop.address && (
                                        <Text style={styles.shopDetail}>Địa chỉ: {shop.address}</Text>
                                    )}
                                    {shop.email && (
                                        <Text style={styles.shopDetail}>Email: {shop.email}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            );
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
        });
    };

    const startNewConversation = () => {
        if (isUserLoggedIn) {
            Alert.alert(
                'Bắt đầu cuộc trò chuyện mới',
                'Bạn có chắc chắn muốn bắt đầu cuộc trò chuyện mới? Lịch sử hội thoại cũ sẽ được lưu lại.',
                [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'Đồng ý',
                        onPress: async () => {
                            try {
                                // For logged-in users, call API to initialize new chat
                                const response = await axios.post(`${new AppConfig().getDomain()}/chatbot/init`, {
                                    userId: userId
                                });

                                if (response.data && response.data.success) {
                                    // Set only the initial greeting message
                                    setMessages([{
                                        id: Math.random().toString(),
                                        text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                                        isUser: false
                                    }]);
                                }
                            } catch (error) {
                                console.error('Failed to start new conversation:', error);
                                Alert.alert('Lỗi', 'Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại sau.');
                            }
                        }
                    }
                ]
            );
        } else {
            // For guest users, clear the sessionId and messages
            setGuestSessionId('');
            AsyncStorage.removeItem('guestChatSessionId');

            // Reset to initial greeting
            setMessages([{
                id: Math.random().toString(),
                text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                isUser: false
            }]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color={CommonColors.white} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Shopping Assistant</Text>
                <TouchableOpacity onPress={startNewConversation}>
                    <Ionicons name="refresh" size={20} color={CommonColors.white} />
                </TouchableOpacity>
            </View>

            {!isUserLoggedIn && (
                <TouchableOpacity
                    style={styles.loginNotice}
                    onPress={() => router.back()}
                >
                    <Text style={styles.loginNoticeText}>
                        Đăng nhập để lưu lịch sử hội thoại
                    </Text>
                    <Ionicons name="log-in-outline" size={16} color="#2196f3" />
                </TouchableOpacity>
            )}

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
};

const styles = StyleSheet.create({
    ...ChatbotStyle,
    productsContainer: {
        marginTop: 10,
        marginBottom: 5,
        maxHeight: 350
    },
    productCard: {
        width: 250,
        height: 350,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginRight: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    productImageContainer: {
        width: '100%',
        height: 200
    },
    productImage: {
        width: '100%',
        height: '100%',
        marginBottom: 8,
    },
    productName: {
        fontWeight: 'bold' as 'bold',
        fontSize: 14,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#e53935',
        fontWeight: '600' as '600',
        marginBottom: 4,
    },
    productDetail: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    viewDetailButton: {
        backgroundColor: '#2196f3',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        alignItems: 'center' as 'center',
        marginTop: 8,
    },
    viewDetailText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600' as '600',
    },
    shopsContainer: {
        marginTop: 10,
    },
    shopCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    shopLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
    },
    shopName: {
        fontWeight: 'bold' as 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    shopDetail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    loginNotice: {
        flexDirection: 'row' as 'row',
        justifyContent: 'center' as 'center',
        alignItems: 'center' as 'center',
        backgroundColor: '#e3f2fd',
        paddingVertical: 8,
        gap: 8
    },
    loginNoticeText: {
        color: '#2196f3',
        fontSize: 14,
    },
})

export default ChatbotScreen;