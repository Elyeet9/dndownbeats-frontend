export interface ICreateSoundtrack {
    title: string;          // Title of the soundtrack
    description: string;    // Description of the soundtrack
    category: string;       // Category to which the soundtrack belongs
    subcategory?: string;   // Optional subcategory for the soundtrack
    thumbnail?: File;       // Thumbnail image file
    url: string;            // URL to the soundtrack file
};