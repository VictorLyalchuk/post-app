import { ITag } from "./ITag";

export interface IGetTags {
    content: ITag[],
    totalPages: number,
    totalCount: number,
    number: number
}