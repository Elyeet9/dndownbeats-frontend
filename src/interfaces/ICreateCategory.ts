export interface ICreateCategory {
    name: string;                // Name of the category
    description: string;         // Description of the category
    thumbnail?: File;            // Optional thumbnail image file for the category
}