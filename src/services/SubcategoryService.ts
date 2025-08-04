import { ISubcategory } from "@/interfaces/ISubcategory";
import { ICreateSubcategory } from "@/interfaces/ICreateSubcategory";
import { API_BASE_URL } from "@/utils/constants";

const API_URL = `${API_BASE_URL}/downbeats`;

export const fetchSubcategory = async (subcategoryId: string): Promise<ISubcategory> => {
    const response = await fetch(`${API_URL}/subcategory/${subcategoryId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch subcategory");
    }
    return response.json();
};

export const createSubcategory = async (subcategoryData: ICreateSubcategory): Promise<null> => {
    const formData = new FormData();
    formData.append('name', subcategoryData.name);
    formData.append('description', subcategoryData.description);
    formData.append('category', subcategoryData.category);

    if (subcategoryData.subcategory) {
        formData.append('subcategory', subcategoryData.subcategory);
    }
    
    if (subcategoryData.thumbnail) {
        formData.append('thumbnail', subcategoryData.thumbnail);
    }

    const response = await fetch(`${API_URL}/create_subcategory`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.text();
        try {
            const errorJson = JSON.parse(errorData);
            throw new Error(errorJson.message || 'Failed to create subcategory');
        } catch {
            throw new Error('Failed to create subcategory');
        }
    }

    return response.json();
};