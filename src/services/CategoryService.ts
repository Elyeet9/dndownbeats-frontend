// Category Service to fetch data related to categories from the API
import { ICategory } from "@/interfaces/ICategory";
import { ICategoryDetail } from "@/interfaces/ICategoryDetail";
import { ICreateCategory } from "@/interfaces/ICreateCategory";
import { API_BASE_URL } from "@/utils/constants";

const API_URL = `${API_BASE_URL}/downbeats`;

export const fetchCategories = async (): Promise<ICategory[]> => {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
};

export const fetchCategory = async (id: string): Promise<ICategoryDetail> => {
    const response = await fetch(`${API_URL}/category/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch category with id ${id}`);
    }
    return response.json();
}

export const createCategory = async (data: ICreateCategory): Promise<null> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
    }

    const response = await fetch(`${API_URL}/create_category`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create category');
    }

    return response.json();
}