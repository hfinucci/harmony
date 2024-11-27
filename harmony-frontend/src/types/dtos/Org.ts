export interface Org {
    id: number;
    name: string;
}

export interface OrgPagination {
    page: number
    totalItems: number,
    totalPages: number,
    orgs: Org[],
}
