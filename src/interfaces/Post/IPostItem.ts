export interface IPostItem {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    category_id: number;
    category: string,
    tags: number[];
    files: string[];
  }