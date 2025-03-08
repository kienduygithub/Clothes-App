import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AppConfig } from "./app.config";

const appConfig = new AppConfig();

const axiosApp = axios.create();

axiosApp.interceptors.request.use(
    async (config) => {
        const accessToken = await appConfig.getAccessToken();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
        }

        return config;
    },
    (error: AxiosError) => {
        console.error("🚨 Lỗi khi gửi request:", error);
        return Promise.reject(error);
    }
);

axiosApp.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error: AxiosError) => {
        return Promise.reject(error);
    }
)

export default axiosApp;