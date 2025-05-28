import { StyleSheet } from "react-native";

const ChatDetailStyle = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesList: {
        padding: 10,
    },
    messageContainer: {
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    ownMessage: {
        justifyContent: 'flex-end',
    },
    otherMessage: {
        justifyContent: 'flex-start',
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 20,
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