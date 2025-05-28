import { UserModel } from "./user.model";

export enum StatusMessage {
    SENDING = 'sending',
    SENT = 'sent'
}

export interface Conversation {
    otherUser: UserModel;
    lastMessage: ChatMessageModel;
    unreadCount: number;
}

export interface ChatAttachment {
    url: string;
    type: string;
    name: string;
    size: number;
}

export class ChatMessageModel {
    id: number;
    senderId: number;
    receiverId: number;
    message: string;
    messageType: 'text' | 'image';
    attachments: ChatAttachment[];
    createdAt: string;
    status?: string;
    sender: UserModel;
    receiver: UserModel;

    constructor(
        id?: number,
        senderId?: number,
        receiverId?: number,
        message?: string,
        messageType?: 'text' | 'image',
        attachments?: ChatAttachment[],
        createdAt?: string,
        status?: string,
        sender?: UserModel,
        receiver?: UserModel,
    ) {
        this.id = id ?? 0;
        this.senderId = senderId ?? 0;
        this.receiverId = receiverId ?? 0;
        this.message = message ?? '';
        this.messageType = messageType ?? 'text';
        this.attachments = attachments ?? [];
        this.createdAt = createdAt ?? new Date().toISOString();
        this.status = status;
        this.sender = sender ?? new UserModel();
        this.receiver = receiver ?? new UserModel();
    }

    fromJson(data: any, preImage: string) {
        const obj = new ChatMessageModel();
        obj.id = data?.id ?? 0;
        obj.senderId = data?.senderId ?? 0;
        obj.receiverId = data?.receiverId ?? 0;
        obj.message = data?.message ?? '';
        obj.messageType = data?.messageType ?? 'text';
        obj.attachments = data?.attachments?.map((att: any) => ({
            ...att,
            url: `${preImage}/${att.url}`
        } as ChatAttachment)) ?? [];
        obj.createdAt = data?.createdAt ?? new Date().toISOString();
        obj.status = data?.status ?? '';
        obj.sender = data?.sender ?? new UserModel();
        obj.receiver = data?.receiver ?? new UserModel();

        return obj;
    }

    static createMessage(data: {
        senderId: number;
        receiverId: number;
        message: string;
        messageType: 'text' | 'image';
        attachments?: ChatAttachment[];
    }): ChatMessageModel {
        const obj = new ChatMessageModel();
        obj.id = Date.now();
        obj.senderId = data.senderId;
        obj.receiverId = data.receiverId;
        obj.message = data.message;
        obj.messageType = data.messageType;
        obj.attachments = data?.attachments ?? [];
        obj.createdAt = new Date().toISOString();
        obj.status = StatusMessage.SENDING;

        return obj;
    }
}