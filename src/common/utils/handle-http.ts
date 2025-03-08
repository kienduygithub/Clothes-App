import { ErrorModel } from "../model/error.model";

export class HandleHttp {

    static success(response: any) {
        return response;
    }

    static exception(result: any) {
        let error = new ErrorModel(
            result?.status,
            result?.error?.message,
            result?.error?.body
        );
        return error;
    }
}