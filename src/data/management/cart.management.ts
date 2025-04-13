import { ErrorModel } from "@/src/common/model/error.model";
import { CartModel } from "../model/cart.model";
import { ProductVariantModel } from "../model/product_variant.model";
import * as CartService from "../service/cart.service";
import { CartShopFinalType } from "../types/global";
import { OrderModel } from "../model/order.model";

export const fetchCartByUser = async () => {
    try {
        const result = await CartService.fetchCartByUser();
        const response: CartModel[] = result?.carts?.map(
            (cart: any) => new CartModel().convertObj(cart)
        ) ?? [];

        if (response.length === 0) {
            return undefined;
        }

        return response[0];
    } catch (error) {
        throw error;
    }
}

export const addCartItem = async (product_variant: ProductVariantModel, quantity: number) => {
    try {
        await CartService.addCartItem(product_variant, quantity);
        return true;
    } catch (error) {
        throw error as ErrorModel;
    }
}

export const updateCartItem = async (item_id: number, product_variant: ProductVariantModel, quantity: number) => {
    try {
        await CartService.updateCartItem(item_id, product_variant, quantity);
        return true;
    } catch (error) {
        throw error;
    }
}

export const updateQuantityCartItem = async (item_id: number, quantity: number) => {
    try {
        await CartService.updateQuantityCartItem(item_id, quantity);
        return true;
    } catch (error) {
        throw error;
    }
}

export const removeCartItem = async (item_id: number) => {
    try {
        await CartService.removeCartItem(item_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const removeCartShop = async (cart_shop_id: number) => {
    try {
        await CartService.removeCartShop(cart_shop_id);
        return true;
    } catch (error) {
        throw error;
    }
}

export const paymentCart = async (
    address_id: number | null,
    cart_shops: CartShopFinalType[],
    subtotal: number,
    discount: number,
    final_total: number
) => {
    try {
        const result = await CartService.paymentCart(
            address_id,
            cart_shops,
            subtotal,
            discount,
            final_total
        );
        const response: OrderModel[] = result?.orders?.map(
            (order: any) => new OrderModel().convertObj(order)
        ) ?? [];
        return response[0];
    } catch (error) {
        throw error;
    }
}