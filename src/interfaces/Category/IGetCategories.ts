import { ICategory } from "./ICategory";

export interface IGetCategories {
    content: ICategory[],
    totalPages: number,
    totalCount: number,
    number: number
}