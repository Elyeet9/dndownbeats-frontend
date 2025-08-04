import { ICategory } from "./ICategory";
import { ISoundtrack } from "./ISoundtrack";

export interface ISubcategory {
    id : number;                    // Unique identifier for the category
    name : string;                  // Name of the category
    description : string;           // Description of the category
    category: number;               // ID of the parent category
    category_name: string;          // Name of the parent category
    thumbnail?: string;             // URL to the thumbnail image
    subcategory?: number;           // ID of the parent subcategory (if any)
    subcategories?: ICategory[];    // List of subcategories within this category
    soundtracks?: ISoundtrack[];    // List of soundtracks in this category
    parent_name?: string;           // Name of the parent category (if any)
}
