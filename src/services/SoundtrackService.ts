import { ICreateSoundtrack } from "@/interfaces/ICreateSoundtrack";
import { ISoundtrack } from "@/interfaces/ISoundtrack";
import { API_BASE_URL } from "@/utils/constants";

const API_URL = `${API_BASE_URL}/downbeats`;

export const createSoundtrack = async (soundtrackData: ICreateSoundtrack): Promise<ISoundtrack> => {
    const formData = new FormData();
    formData.append('title', soundtrackData.title);
    formData.append('description', soundtrackData.description);
    formData.append('category', soundtrackData.category);
    formData.append('url', soundtrackData.url);
    
    if (soundtrackData.subcategory) {
        formData.append('subcategory', soundtrackData.subcategory);
    }
    
    if (soundtrackData.thumbnail) {
        formData.append('thumbnail', soundtrackData.thumbnail);
    }

    const response = await fetch(`${API_URL}/create_soundtrack`, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.text();
        try {
            const errorJson = JSON.parse(errorData);
            throw new Error(errorJson.message || 'Failed to create soundtrack');
        } catch {
            throw new Error('Failed to create soundtrack');
        }
    }

    return response.json();
};
