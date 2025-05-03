import { OrderStatus } from "@/src/common/resource/order_status";
import { OrderItemModel, OrderModel, OrderShopModel } from "../model/order.model";

export const mockOrders: OrderModel[] = [
    new OrderModel(
        1,
        undefined,
        undefined,
        [
            new OrderShopModel(
                1,
                { name: 'Tech Store' } as any,
                [
                    new OrderItemModel(1, { name: 'Wireless Earbuds', price: 599000 } as any, 2),
                    new OrderItemModel(2, { name: 'Phone Case', price: 99000 } as any, 1),
                ],
                undefined,
                697000,
                50000,
                647000
            ),
        ],
        647000,
        OrderStatus.PENDING,
        new Date('2025-05-01T10:00:00'),
        new Date('2025-05-01T10:00:00'),
        new Date('2025-05-01T09:30:00')
    ),
    new OrderModel(
        2,
        undefined,
        undefined,
        [
            new OrderShopModel(
                2,
                { name: 'Fashion Hub' } as any,
                [
                    new OrderItemModel(3, { name: 'Summer Dress', price: 299000 } as any, 1),
                ],
                undefined,
                299000,
                0,
                299000
            ),
        ],
        299000,
        OrderStatus.COMPLETED,
        new Date('2025-04-30T15:00:00'),
        new Date('2025-04-30T15:00:00'),
        new Date('2025-04-30T14:45:00')
    ),
];