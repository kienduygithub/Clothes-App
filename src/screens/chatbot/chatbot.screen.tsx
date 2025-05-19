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
import ChatListSessionComponent from './chat_list_session.component';

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
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [sessions, setSessions] = useState<any[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [preImage, setPreImage] = useState<string>('');
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        fetchPreImage();
        const init = async () => {
            const user = await new AppConfig().getUserInfo();
            if (user && user.id) {
                setIsUserLoggedIn(true);
                setUserId(user.id);
                // Tạo session mới cho user
                const res = await axios.post(`${new AppConfig().getDomain()}/chatbot/session`, { userId: user.id });
                setSessionId(res.data.data.sessionId);
                // Lấy danh sách session
                const listRes = await axios.get(`${new AppConfig().getDomain()}/chatbot/sessions?userId=${user.id}`);
                setSessions(listRes.data.data);
            } else {
                setIsUserLoggedIn(false);
                setUserId(null);
                // Tạo session mới cho guest
                const res = await axios.post(`${new AppConfig().getDomain()}/chatbot/session`, {});
                setSessionId(res.data.data.sessionId);
            }
        };
        init();
        return () => {
            setSessionId(null);
        };
    }, []);

    useEffect(() => {
        if (!sessionId) return;
        const fetchHistory = async () => {
            const res = await axios.get(`${new AppConfig().getDomain()}/chatbot/history?sessionId=${sessionId}`);
            setMessages(res.data.data || []);
        };
        fetchHistory();
    }, [sessionId]);

    const fetchPreImage = () => {
        const preImage = new AppConfig().getPreImage();
        setPreImage(preImage);
    };

    const sendMessage = useCallback(async () => {
        if (!inputText.trim() || !sessionId) return;
        setLoading(true);
        setInputText('');
        try {
            const response = await axios.post(`${new AppConfig().getDomain()}/chatbot/message`, {
                sessionId,
                userId: isUserLoggedIn ? userId : null,
                message: inputText
            });
            if (response.data && response.data.success) {
                const mapped = (response.data.data.messages || []).map((msg: any, idx: number) => ({
                    id: msg.id || `${msg.role}-${idx}-${Date.now()}`,
                    text: msg.content,
                    isUser: msg.role === 'user',
                    searchResults: msg.searchResults
                }));
                setMessages(mapped);
            }
        } catch (error) {
            const errorMessage = {
                id: `error-${Date.now()}`,
                text: 'Xin lỗi, có vẻ đã xảy ra sự cố. Vui lòng thử lại sau.',
                isUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    }, [inputText, sessionId, userId, isUserLoggedIn]);

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

    const startNewConversation = async () => {
        if (isUserLoggedIn) {
            try {
                // Tạo session mới cho user
                const response = await axios.post(`${new AppConfig().getDomain()}/chatbot/session`, { userId });
                if (response.data && response.data.success) {
                    setSessionId(response.data.data.sessionId);
                    // Lấy lại danh sách session
                    const listRes = await axios.get(`${new AppConfig().getDomain()}/chatbot/sessions?userId=${userId}`);
                    setSessions(listRes.data.data);
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể tạo cuộc trò chuyện mới. Vui lòng thử lại sau.');
            }
        } else {
            // Guest: tạo session mới, xóa sessionId cũ khỏi state
            setSessionId(null);
            setMessages([{
                id: Math.random().toString(),
                text: 'Xin chào! Tôi là ClothesShop Assistant. Tôi có thể giúp bạn tìm kiếm quần áo, phụ kiện và trả lời các câu hỏi về sản phẩm của chúng tôi. Bạn muốn tìm kiếm sản phẩm gì hôm nay?',
                isUser: false
            }]);
        }
    };

    const handleSelectSession = async (selectedSessionId: string) => {
        setSessionId(selectedSessionId);
        const res = await axios.get(`${new AppConfig().getDomain()}/chatbot/history?sessionId=${selectedSessionId}`);
        setMessages(res.data.data || []);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* Drawer danh sách session */}
            <ChatListSessionComponent
                visible={drawerVisible}
                onClose={() => setDrawerVisible(false)}
                onSelectSession={handleSelectSession}
                sessions={sessions}
                currentSessionId={sessionId || ''}
            />
            <View style={styles.container}>
                <View style={styles.header}>
                    {isUserLoggedIn && (
                        <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.menuButton}>
                            <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
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
        </View>
    );
};

const styles = StyleSheet.create({
    ...ChatbotStyle,
    menuButton: {
        padding: 8,
        marginRight: 8,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196f3',
        paddingTop: 32,
        paddingBottom: 12,
        paddingHorizontal: 12,
        justifyContent: 'flex-start',
    },
    headerText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        flex: 1,
        textAlign: 'center',
    },
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