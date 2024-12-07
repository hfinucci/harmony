export interface Album {
    id: number;
    name: string;
    org: number;
}

export interface AlbumPagination {
    page: number
    totalItems: number,
    totalPages: number,
    albums: Album[],
}