export enum OrderStatus {
    PENDING = "pending",
    PAID = "paid",
    SHIPPED = "shipped",
    COMPLETED = "completed",
    CANCELED = "canceled",
    PROCESSING = 'processing'
}

export const getStatusTextAndColorOrder = (status: string) => {
    switch (status) {
        case OrderStatus.PENDING:
            return { text: 'Chờ xác nhận', color: '#F59E0B' };
        case OrderStatus.PROCESSING:
            return { text: 'Đang xử lý', color: '#3B82F6' };
        case OrderStatus.SHIPPED:
            return { text: 'Đang giao', color: '#10B981' };
        case OrderStatus.COMPLETED:
            return { text: 'Hoàn thành', color: '#22C55E' };
        default:
            return { text: 'Không xác định', color: '#6B7280' };
    }
} 