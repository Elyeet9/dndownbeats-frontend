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

export const deleteCategoryCounts = async (categoryId: string): Promise<{subcategories_count: number, soundtracks_count: number}> => {
    const response = await fetch(`${API_URL}/delete_category/${categoryId}/`, {
        method: 'GET'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete category counts');
    }

    return response.json();
}

export const deleteCategory = async (categoryId: string): Promise<null> => {
    const response = await fetch(`${API_URL}/delete_category/${categoryId}/`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete category');
    }

    return response.json();
}

export const updateCategory = async (categoryId: string, data: ICreateCategory): Promise<null> => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
    }

    const response = await fetch(`${API_URL}/category/${categoryId}/`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update category');
    }

    return response.json();
}