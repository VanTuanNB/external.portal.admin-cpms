/* eslint-disable @typescript-eslint/no-explicit-any */

import { ApiResponse } from '@/core/interfaces/common.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RequestOptions<T = any, K = any> = {
    payload?: T;
    headers?: HeadersInit;
    queryParams?: K;
    slug?: string;
};

export type IParamsRequestApi<T = any> = RequestOptions & {
    onSuccess: (res: ApiResponse) => void;
    onError: (res: ApiResponse) => void;
};
