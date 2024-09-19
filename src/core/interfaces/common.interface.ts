/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponsePaging<T = any> {
    isSuccess: boolean;
    data: {
        items: T;
        totalPages: number;
        page: number;
        size: number;
        total: number;
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
