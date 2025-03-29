export class ShopModel {
    id: number;
    shop_name: string;
    logo_url: string;
    background_url: string;

    constructor(
        id?: number,
        shop_name?: string,
        logo_url?: string,
        background_url?: string,
    ) {
        this.id = id ?? 0;
        this.shop_name = shop_name ?? '';
        this.logo_url = logo_url ?? '';
        this.background_url = background_url ?? '';
    }

    convertObj(data: any) {
        const obj = new ShopModel();
        obj.id = data?.id ?? 0;
        obj.shop_name = data?.shop_name ?? '';
        obj.logo_url = data?.logo_url ?? '';
        obj.background_url = data?.background_url ?? '';

        return obj;
    }
}