import { ObjectId } from 'mongodb';

export interface ExperienceRequiredDocument {
    minYears: number;
    maxYears?: number;
}

export interface StatisticsDocument {
    totalResumes: number;
    strongMatches: number;
    averageScore: number;
}

export interface JobDescriptionDocument {
    _id?: ObjectId;
    userId: string;
    position: string;
    experienceRequired: ExperienceRequiredDocument;
    requiredSkills: string[];
    requiredQualifications?: string[];
    niceToHaveSkills?: string[];
    niceToHaveQualifications?: string[];
    responsibilities: string[];
    stats?: StatisticsDocument;
    createdAt: Date;
    updatedAt: Date;
}