import * as ShopService from "@/src/data/service/shop.service";
import { ShopModel } from "../model/shop.model";

export const fetchShopById = async (id: number) => {
    try {
        const result = await ShopService.fetchShopById(id);
        const response: ShopModel[] = result?.shops?.map(
            (shop: any) => new ShopModel().convertObj(shop)
        );

        if (response.length === 0) {
            return undefined;
        }

        return response[0];
    } catch (error) {
        throw error;
    }
}