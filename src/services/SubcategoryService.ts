import { ISubcategory } from "@/interfaces/ISubcategory";
import { API_BASE_URL } from "@/utils/constants";

const API_URL = `${API_BASE_URL}/downbeats`;

export const fetchSubcategory = async (subcategoryId: string): Promise<ISubcategory> => {
    const response = await fetch(`${API_URL}/subcategory/${subcategoryId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch subcategory");
    }
    return response.json();
};