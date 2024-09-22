import { Dayjs } from 'dayjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponsePaging<T = any> {
    isSuccess: boolean;
    data: {
        items: T[];
        totalItems: number;
        totalPages: number;
        page: number;
        limit: number;
    };
    message: string;
    statusCode: string;
    errors?: unknown;
}

export interface ApiResponse<T = any> {
    isSuccess: boolean;
    data: T;
    message: string;
    statusCode: string;
    errors?: unknown;
}

export interface IDefineApiDocument {
    endpoint: string;
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTION';
}

export interface IFilterParams {
    page: number;
    limit: number;
    keyword?: string;
    durationStart: null | Dayjs;
    durationEnd: null | Dayjs;
}
