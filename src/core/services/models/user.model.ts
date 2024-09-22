export interface IUserEntity {
    id: string;
    name: string;
    birthday: string;
    phone: string;
    address: string;
    email: string;
    password: string;
    roles: string[];
    refreshToken: string;
    courses?: string[];
    coursesRegistering?: string[];
    createdAt?: string;
    updatedAt?: string;
}
