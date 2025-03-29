export class ShopModel {
    id: number;
    shop_name: string;
    logo_url: string;
    background_url: string;
    contact_address: string;
    contact_email: string;

    constructor(
        id?: number,
        shop_name?: string,
        logo_url?: string,
        background_url?: string,
        contact_address?: string,
        contact_email?: string,

    ) {
        this.id = id ?? 0;
        this.shop_name = shop_name ?? '';
        this.logo_url = logo_url ?? '';
        this.background_url = background_url ?? '';
        this.contact_address = contact_address ?? '';
        this.contact_email = contact_email ?? '';
    }

    convertObj(data: any) {
        const obj = new ShopModel();
        obj.id = data?.id ?? 0;
        obj.shop_name = data?.shop_name ?? '';
        obj.logo_url = data?.logo_url ?? '';
        obj.background_url = data?.background_url ?? '';
        obj.contact_address = data?.contact_address ?? '';
        obj.contact_email = data?.contact_email ?? '';

        return obj;
    }
}