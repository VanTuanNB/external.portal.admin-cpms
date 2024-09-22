export interface ICourseEntity {
    id: string;
    title: string;
    code: string;
    durationStart: string;
    durationEnd: string;
    quantity: number;
    faculty: string;
    // faq?: string[];
    requirements: string[];
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}
