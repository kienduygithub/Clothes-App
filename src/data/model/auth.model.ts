export class AuthModel {
    email: string;
    password: string;

    constructor(
        email?: string,
        password?: string
    ) {
        this.email = email ?? '';
        this.password = password ?? '';
    }

    convertModelToExecute(data: AuthModel) {
        return {
            email: data.email,
            password: data.password
        }
    }
}