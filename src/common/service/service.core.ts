import axiosApp from "../config/axios.config";
import { HandleHttp } from "../utils/handle-http";

export class ServiceCore {

    static async GET(domain: string, url: string, config?: any): Promise<any> {
        try {
            const response = axiosApp.get(
                `${domain}/${url}`,
                config ?? {}
            );
            return HandleHttp.success(response);
        } catch (error) {
            throw HandleHttp.exception(error);
        }
    }

    static async POST(domain: string, url: string, data: any, config?: any): Promise<any> {
        try {
            const response = axiosApp.post(
                `${domain}/${url}`,
                data,
                config ?? {}
            );
            return HandleHttp.success(response);
        } catch (error) {
            throw HandleHttp.exception(error);
        }
    }

    static async PUT(domain: string, url: string, data: any, config?: any): Promise<any> {
        try {
            const response = axiosApp.put(
                `${domain}/${url}`,
                data,
                config ?? {}
            );
            return HandleHttp.success(response);
        } catch (error) {
            throw HandleHttp.exception(error);
        }
    }

    static async PATCH(domain: string, url: string, data: any, config?: any): Promise<any> {
        try {
            const response = axiosApp.patch(
                `${domain}/${url}`,
                data,
                config ?? {}
            );
            return HandleHttp.success(response);
        } catch (error) {
            throw HandleHttp.exception(error);
        }
    }

    static async DELETE(domain: string, url: string, config?: any): Promise<any> {
        try {
            const response = axiosApp.delete(
                `${domain}/${url}`,
                config ?? {}
            );
            return HandleHttp.success(response);
        } catch (error) {
            throw HandleHttp.exception(error);
        }
    }

}