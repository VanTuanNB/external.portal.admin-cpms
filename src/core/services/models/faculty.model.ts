export interface IFacultyEntity {
    id: string;
    title: string;
    description: string;
    code: string;
    curriculum: string;
    durationStart: string;
    durationEnd: string;
    courses: string[];
    createdAt?: string;
    updatedAt?: string;
}
