export interface IPostCreate {
    title: string;
    shortDescription: string;
    description: string;
    category_id: string;
    tags: number[];
    files: File[];
  }