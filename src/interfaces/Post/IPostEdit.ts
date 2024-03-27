export interface IPostEdit {
    id: string;
    title: string;
    shortDescription: string;
    description: string;
    category_id: string;
    tags: number[];
    newPhotos: IPostEditPhoto[] | null,
    oldPhotos: IPostEditPhoto[] | null,
  }

  export interface IPostEditPhoto{
    name: string | undefined,
}