import { StyleSheet } from "react-native";

const ChatDetailStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: 16,
        fontWeight: '600',
    },
    onlineStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    onlineIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    onlineIndicatorActive: {
        backgroundColor: '#4CAF50',
    },
    onlineIndicatorInactive: {
        backgroundColor: '#9E9E9E',
    },
    headerStatus: {
        fontSize: 12,
        color: '#666',
    },

    messagesList: {
        padding: 16,
    },
    messageContainer: {
        // marginVertical: 5,
        // flexDirection: 'row',
        // alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 5,
    },
    ownMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    messageBubble: {
        maxWidth: '70%',
        padding: 12,
        borderRadius: 16,
    },
    ownBubble: {
        backgroundColor: '#0084ff',
        borderBottomRightRadius: 5,
    },
    otherBubble: {
        backgroundColor: '#f0f0f0',
        borderBottomLeftRadius: 5,
    },
    messageText: {
        fontSize: 16,
    },
    ownMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#000',
    },
    messageFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    timeText: {
        fontSize: 12,
        color: '#8e8e8e',
    },
    imageMessage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 5,
    },
    statusContainer: {
        marginLeft: 5,
        marginBottom: 2,
    },
    statusText: {
        fontSize: 12,
        color: '#8e8e8e',
    },
    errorText: {
        color: '#ff3b30',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        fontSize: 16,
    },
    sendButton: {
        padding: 10,
    },
})

export default ChatDetailStyle;