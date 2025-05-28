import { StyleSheet } from "react-native";

const ListChatStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesList: {
        padding: 10,
    },
    conversationItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    conversationContent: {
        flex: 1,
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    timeAgo: {
        fontSize: 12,
        color: '#666',
    },
    messagePreview: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginRight: 10,
    },
    unreadMessage: {
        color: '#000',
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: '#0084ff',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
})

export default ListChatStyle;