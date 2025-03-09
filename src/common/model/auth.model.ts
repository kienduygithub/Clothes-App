export class AuthModel {
    email: string;
    password: string;

    constructor() {
        this.email = '';
        this.password = '';
    }

    loginEmailModel(authModel: AuthModel) {
        return {
            email: authModel.email,
            password: authModel.password
        }
    }
}

export class ChangePassOTPModel {
    email: string;

    constructor(email?: string) {
        this.email = email ?? '';
    }
}