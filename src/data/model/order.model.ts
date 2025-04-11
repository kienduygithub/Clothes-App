import { OrderStatus } from "@/src/common/resource/order_status";
import { AddressModel } from "./address.model";
import { CouponModel } from "./coupon.model";
import { ProductVariantModel } from "./product_variant.model";
import { ShopModel } from "./shop.model";
import { UserModel } from "./user.model";

export class OrderModel {
    id: number;
    user: UserModel | undefined;
    address: AddressModel | undefined;
    order_shops: OrderShopModel[];
    total_price: number;
    status: string;
    status_changed_at: Date | null;
    payment_date: Date | null;
    created_at: Date | null;

    constructor(
        id?: number,
        user?: UserModel,
        address?: AddressModel,
        order_shops?: OrderShopModel[],
        total_price?: number,
        status?: string,
        status_changed_at?: Date,
        payment_date?: Date,
        created_at?: Date
    ) {
        this.id = id ?? 0;
        this.user = user ?? undefined;
        this.address = address ?? undefined;
        this.order_shops = order_shops ?? [];
        this.total_price = total_price ?? 0;
        this.status = status ?? OrderStatus.COMPLETED;
        this.status_changed_at = status_changed_at ? new Date(status_changed_at) : null;
        this.payment_date = payment_date ? new Date(payment_date) : null;
        this.created_at = created_at ? new Date(created_at) : null;
    }
}

export class OrderShopModel {
    id: number;
    shop: ShopModel | undefined;
    order_items: OrderItemModel[];
    coupon: CouponModel | undefined;
    subtotal: number;
    discount: number;
    final_total: number;

    constructor(
        id?: number,
        shop?: ShopModel,
        order_items?: OrderItemModel[],
        coupon?: CouponModel,
        subtotal?: number,
        discount?: number,
        final_total?: number
    ) {
        this.id = id ?? 0;
        this.shop = shop ?? undefined;
        this.order_items = order_items ?? [];
        this.coupon = coupon ?? undefined;
        this.subtotal = subtotal ?? 0;
        this.discount = discount ?? 0;
        this.final_total = final_total ?? 0;
    }

    convertObj(data: any) {

    }
}

export class OrderItemModel {
    id: number;
    product_variant: ProductVariantModel | undefined;
    quantity: number;

    constructor(
        id?: number,
        product_variant?: ProductVariantModel,
        quantity?: number,
    ) {
        this.id = id ?? 0;
        this.product_variant = product_variant ?? undefined;
        this.quantity = quantity ?? -1;
    }

    convertObj(data: any) {
        const obj = new OrderItemModel();
        obj.id = data?.id ?? 0;
        obj.product_variant = data?.product_variant ? new ProductVariantModel().convertObj(data.product_variant) : undefined;
        obj.quantity = data?.quantity;

        return obj;
    }
}