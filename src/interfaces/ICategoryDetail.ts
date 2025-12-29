import { ICategory } from "./ICategory";
import { ISoundtrack } from "./ISoundtrack";

export interface ICategoryDetail {
    id : number;                    // Unique identifier for the category
    name : string;                  // Name of the category
    description : string;           // Description of the category
    thumbnail : string;             // URL to the thumbnail image
    subcategories : ICategory[];    // List of subcategories within this category
    soundtracks : ISoundtrack[];    // List of soundtracks associated with this category
}