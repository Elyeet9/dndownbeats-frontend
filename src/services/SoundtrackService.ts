import { ICreateSoundtrack } from "@/interfaces/ICreateSoundtrack";
import { API_BASE_URL } from "@/utils/constants";

const API_URL = `${API_BASE_URL}/downbeats`;

const createSoundtrack = async (soundtrackData: ICreateSoundtrack): Promise<null> => {
    const formData = new FormData();
    formData.append('title', soundtrackData.title);
    formData.append('description', soundtrackData.description);
    formData.append('url', soundtrackData.url);
    if (soundtrackData.thumbnail) {
        formData.append('thumbnail', soundtrackData.thumbnail);
    }

    const response = await fetch(`${API_URL}/soundtrack`, {
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
