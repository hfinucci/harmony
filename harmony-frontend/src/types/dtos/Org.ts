export interface Org {
    id: number;
    name: string;
    image: string;
}

export interface OrgPagination {
    page: number
    totalItems: number,
    totalPages: number,
    orgs: Org[],
}
