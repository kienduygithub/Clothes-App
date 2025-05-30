import { Conversation } from "@/src/data/model/chat-message.model";
import ListChatStyle from "./list-chat.style";
import * as ChatMessageMana from "@/src/data/management/chat-message.management";
import * as UserActions from "@/src/data/store/actions/user/user.action";
import { RootState } from "@/src/data/types/global";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserStoreState } from "@/src/data/store/reducers/user/user.reducer";
import { useToast } from "@/src/customize/toast.context";
import { MessageError } from "@/src/common/resource/message-error";
import { router, useFocusEffect } from "expo-router";
import { Animated, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { AppConfig } from "@/src/common/config/app.config";
import { useHeaderHeight } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { CommonColors } from "@/src/common/resource/colors";

type Props = {}

const ListChatScreen = (props: Props) => {
    const { showToast } = useToast();
    const userSelector: UserStoreState = useSelector((state: RootState) => state.userLogged);
    const [preImage, setPreImage] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const dispatch = useDispatch();
    const headerHeight = useHeaderHeight();
    const [fadeAnim] = useState(new Animated.Value(0));

    // useFocusEffect(useCallback(() => {
    //     fetchPreImage();
    //     fetchConversations();
    //     Animated.timing(fadeAnim, {
    //         toValue: 1,
    //         duration: 800,
    //         useNativeDriver: true,
    //     }).start();
    // }, []))

    useEffect(() => {
        fetchPreImage();
        fetchConversations();
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, [])

    const fetchPreImage = () => {
        setPreImage(new AppConfig().getPreImage());
    }

    const fetchConversations = async () => {
        if (!userSelector.isLogged) {
            return;
        }

        try {
            const response = await ChatMessageMana.fetchConversations();
            setConversations(response);
        } catch (error) {
            console.log(error);
            showToast(MessageError.BUSY_SYSTEM, 'error');
        }
    }

    const handleConversationPress = (receiverId: number, shopId: number) => {
        router.push({
            pathname: '/(routes)/chat-detail',
            params: {
                id: receiverId,
                shopId: shopId
            }
        });
    };

    const formatTimeAgo = (date: string) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 30) return `${diffInDays} ngày trước`;

        const diffInMonths = Math.floor(diffInDays / 30);
        if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

        return `${Math.floor(diffInMonths / 12)} năm trước`;
    };

    const renderConversation = ({ item }: { item: Conversation }) => {
        const { otherUser, lastMessage, unreadCount } = item;

        return (
            <TouchableOpacity
                style={styles.conversationItem}
                onPress={() => handleConversationPress(otherUser.id, otherUser.shopId ?? 0)}
            >
                <Image
                    source={{ uri: `${preImage}/${otherUser.image_url}` }}
                    style={styles.avatar}
                />
                <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                        <Text style={styles.userName} numberOfLines={1}>
                            {otherUser.name}
                        </Text>
                        <Text style={styles.timeAgo}>
                            {formatTimeAgo(lastMessage.createdAt)}
                        </Text>
                    </View>
                    <View style={styles.messagePreview}>
                        <Text
                            style={[
                                styles.lastMessage,
                                unreadCount > 0 && styles.unreadMessage
                            ]}
                            numberOfLines={1}
                        >
                            {lastMessage.senderId === userSelector.id ? 'Bạn: ' : ''}
                            {
                                lastMessage.messageType === 'image'
                                    ? 'Đã gửi hình ảnh'
                                    : lastMessage.message
                            }
                        </Text>
                        {unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadCount}>
                                    {unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { marginTop: headerHeight }]}>
            <LinearGradient
                colors={['#33adff', '#3b82f6']}
                style={styles.header}
            >
                <View style={styles.headerContent}>
                    <View style={styles.userInfo}>
                        {userSelector.image_url === '' ? (
                            <Image
                                source={{
                                    uri: 'https://tiki.vn/blog/wp-content/uploads/2023/01/Y7deW5ZtpOonbiD_XawHLHdkjKYKHvWxvxNZzKdXXn0L8InieLIH_-U5m0u-RUlFtXKp0Ty91Itj4Oxwn_tjKg_UZo3lxFSrOH_DHIbpKP1LDn80z6BbOxj4d8bmymdy8PWFGjLkTpCdoz-3X-KY7IedQ_dxWJlHSIBWwCYhgM02FvUfVUgLKOQxrQWgjw.jpg',
                                }}
                                style={styles.infoImage}
                            />
                        ) : (
                            <Image
                                source={{ uri: `${preImage}/${userSelector.image_url}` }}
                                style={styles.infoImage}
                            />
                        )}
                        <View>
                            <Text style={styles.username}>
                                {userSelector.name === '' ? 'Anonymous' : userSelector.name}
                            </Text>
                            <Text style={styles.tagline}>Tin nhắn của bạn</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 'auto' }}>
                        <MaterialIcons name="logout" size={24} color={CommonColors.white} />
                    </TouchableOpacity>
                </View>
            </LinearGradient>
            <FlatList
                data={conversations}
                renderItem={renderConversation}
                keyExtractor={item => item.otherUser.id.toString()}
                contentContainerStyle={styles.messagesList}
            />
        </View>
    )
}

const styles = ListChatStyle;

export default ListChatScreen;