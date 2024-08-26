export interface Song {
    id: number;
    name: string;
    org?: string;
    album: number;
    composeId: string;
    created: string;
    lastmodified: string;
    composeid: string;
}

export interface SongPagination {
    page: number
    totalItems: number,
    totalPages: number,
    songs: Song[],
}

export interface SinglePagination {
    page: number
    totalItems: number,
    totalPages: number,
    singles: Song[],
}