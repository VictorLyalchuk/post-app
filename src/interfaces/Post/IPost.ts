import { ITag } from "../Tag/ITag";

export interface IPost {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    dateCreated: Date;
    category: string;
    category_name: string;
    tags: ITag[];
    postImages: string[];
    files: string[];
  }