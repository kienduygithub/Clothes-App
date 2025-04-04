import AsyncStorage from "@react-native-async-storage/async-storage";

export class AppConfig {
    private domain = '';
    private preImage = '';

    constructor() { }

    getDomain() {
        return this.domain;
    }

    getPreImage() {
        return this.preImage;
    }

    async getAccessToken() {
        const accessToken = await AsyncStorage.getItem('access-token');
        if (!accessToken) {
            return null;
        }

        return accessToken;
    }

    async setAccessToken(token: string) {
        try {
            await AsyncStorage.setItem('access-token', token);
        } catch (error) {
            console.log(error);
        }
    }

    async getRefreshToken() {
        const accessToken = await AsyncStorage.getItem('refresh-token');
        if (!accessToken) {
            return null;
        }

        return accessToken;
    }

    async setRefreshToken(token: string) {
        try {
            await AsyncStorage.setItem('refresh-token', token);
        } catch (error) {
            console.log(error);
        }
    }

    async clear() {
        await AsyncStorage.clear();
    }
}