/* eslint-disable @typescript-eslint/no-explicit-any */

import { environment } from '../configs/env.config';
import { IDefineApiDocument } from '../interfaces/common.interface';
import { LocalStorageSide } from '../utils/storage.util';
import { RequestOptions } from './models/base-core.model';

export class BaseCoreService {
    private token = '';
    constructor() {
        this.token = new LocalStorageSide().getStore('cpms-user-info')?.accessToken || '';
    }

    public async requestApiWithAuth<T = any>(document: IDefineApiDocument, options?: RequestOptions): Promise<T> {
        const endpoint = this.handleConfigEndpointUrl(document, options);
        const body = this.handlePayloadByMethod(document.method, options);
        return await fetch(endpoint, {
            method: document.method,
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            body: body,
        }).then((res) => res.json());
    }

    public async requestApi<T = any>(document: IDefineApiDocument, options?: RequestOptions): Promise<T> {
        const endpoint = this.handleConfigEndpointUrl(document, options);
        const body = this.handlePayloadByMethod(document.method, options);
        return await fetch(endpoint, {
            method: document.method,
            headers: options ? options.headers : undefined,
            body,
        }).then((res) => res.json());
    }

    private handleConfigEndpointUrl(document: IDefineApiDocument, options?: RequestOptions) {
        console.log('process.env', process.env);
        console.log(environment);
        let endpoint = document.endpoint;
        if (options && options.slug) {
            endpoint = `${endpoint}/${options.slug}`;
        }
        if (options && options.queryParams && Object.keys(options.queryParams).length) {
            const queryParams = Object.keys(options.queryParams)
                .filter((key) => options.queryParams[key])
                .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(options.queryParams[key])}`)
                .join('&');
            endpoint = `${endpoint}?${queryParams}`;
        }
        return `${environment.apiEndpoint}/${environment.prefixApi}${endpoint}`;
    }

    private handlePayloadByMethod(method: IDefineApiDocument['method'], options?: RequestOptions) {
        if (!options) return undefined;
        switch (method) {
            case 'GET':
            case 'HEAD':
                return undefined;
            default:
                return JSON.stringify(options?.payload);
        }
    }
}
