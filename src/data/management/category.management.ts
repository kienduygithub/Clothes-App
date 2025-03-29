import { CategoryModel } from "../model/category.model";
import * as CategoryService from "../service/category.service";

export const fetchParentCategories = async () => {
    try {
        const result = await CategoryService.fetchParentCategories();
        const response = result?.categories?.map(
            (category: any) => new CategoryModel().convertObj(category)
        ) ?? [];
        return response;
    } catch (error) {
        throw error;
    }
}