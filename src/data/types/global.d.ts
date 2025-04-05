export interface ProductType {
    id: number;
    title: string;
    price: number;
    description: string;
    images: string[];
    category: Category;
}

interface Category {
    id: number;
    name: string;
    image: string;
}

export interface CategoryType {
    id: number;
    name: string;
    image: string;
}

export interface NotificationType {
    id: number;
    title: string;
    message: string;
    timestamp: string;
}

export interface CartItemType {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
}

// MAIN

export interface ColorType {
    id: number,
    color_name: string,
    image_url: string
}

export interface SizeType {
    id: number,
    size_code: string,
}

type CartChecked = {
    [cartShopId: number]: {
        checked: boolean;
        cart_items: {
            [cartItemId: number]: boolean;
        }
    }
}