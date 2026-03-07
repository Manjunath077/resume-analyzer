export interface ExperienceRequired {
    minYears: number;
    maxYears?: number;
}

export interface JobDescriptionDto {
    _id: string;
    userId: string;
    position: string;
    experienceRequired: ExperienceRequired;
    requiredSkills: string[];
    requiredQualifications?: string[];
    niceToHaveSkills?: string[];
    niceToHaveQualifications?: string[];
    responsibilities: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface SortInfo {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface JobDescriptionStats {
    totalJDs: number;
    totalResumes: number;
    averageScore: number;
    strongMatches: number;
}

export interface JobDescriptionResponse {
    content: JobDescriptionDto[];
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    size: number;
    number: number;
    sort: SortInfo;
    numberOfElements: number;
    empty: boolean;
    stats: JobDescriptionStats;
}