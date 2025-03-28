export class UserModel {
    id: number;
    name: string;
    email: string;
    gender: string;
    phone: string;
    address: string;
    image_url: string;
    roles: string;

    constructor(
        id?: number,
        name?: string,
        email?: string,
        gender?: string,
        phone?: string,
        address?: string,
        image_url?: string,
        roles?: string,
    ) {
        this.id = id ?? 0;
        this.name = name ?? '';
        this.email = email ?? '';
        this.gender = gender ?? '';
        this.phone = phone ?? '';
        this.address = address ?? '';
        this.image_url = image_url ?? '';
        this.roles = roles ?? '';
    }

    convertObj(data: any) {
        const model = new UserModel();
        model.id = data?.id ?? 0;
        model.name = data?.name ?? '';
        model.email = data?.email ?? '';
        model.gender = data?.gender ?? '';
        model.phone = data?.phone ?? '';
        model.address = data?.address ?? '';
        model.image_url = data?.image_url ?? '';
        model.roles = data?.roles ?? '';

        return model;
    }
}