export interface ICreateSubcategory {
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    thumbnail?: File;
}
