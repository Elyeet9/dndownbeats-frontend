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

export const deleteSoundtrack = async (soundtrackId: string): Promise<null> => {
    const response = await fetch(`${API_URL}/delete_soundtrack/${soundtrackId}/`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete soundtrack');
    }

    return response.json();
};

export const updateSoundtrack = async (soundtrackId: string, data: ICreateSoundtrack): Promise<null> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('url', data.url);
    
    if (data.subcategory) {
        formData.append('subcategory', data.subcategory);
    }
    
    if (data.thumbnail) {
        formData.append('thumbnail', data.thumbnail);
    }

    const response = await fetch(`${API_URL}/soundtrack/${soundtrackId}/`, {
        method: 'PUT',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update soundtrack');
    }

    return response.json();
};
