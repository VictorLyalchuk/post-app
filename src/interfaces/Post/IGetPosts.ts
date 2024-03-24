import { IPost } from "./IPost";

export interface IGetPosts {
    list: IPost[],
    totalPages: number,
    totalCount: number,
    number: number
}