import * as OrderService from "@/src/data/service/order.service";
import { OrderModel } from "../model/order.model";

export const fetchFavoritesByUser = async () => {
    try {
        const result = await OrderService.fetchListOrderUser();
        const response: OrderModel[] = result?.orders?.map(
            (order: any) => new OrderModel().convertObj(order)
        ) ?? [];

        return response;
    } catch (error) {
        throw error;
    }
}