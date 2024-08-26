export interface Album {
    id: number;
    name: string;
    org: number;
    image: string;
}

export interface AlbumPagination {
    page: number
    totalItems: number,
    totalPages: number,
    albums: Album[],
}